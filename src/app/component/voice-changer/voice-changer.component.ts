import {Component, OnInit} from '@angular/core';
import bufferLoader from './buffer-loader';

@Component({
    selector   : 'app-voice-changer',
    templateUrl: './voice-changer.component.html',
    styleUrls  : ['./voice-changer.component.css']
})
export class VoiceChangerComponent implements OnInit {
    audioContext: AudioContext = new AudioContext();
    audioSources: Array<any>   = [];
    spectrumAudioAnalyser: AnalyserNode;
    sonogramAudioAnalyser: AnalyserNode;
    pitchShifterProcessor: any;

    private spectrumFFTSize: number;
    private spectrumSmoothing: number;
    private sonogramFFTSize: number;
    private sonogramSmoothing: number;

    private validGranSizes: Array<number>;

    grainSize: number;
    grainSizeKey: number;
    pitchRatio: number;
    overlapRatio: number;
    audioSourceIndex: number;

    pitchRatioSetting: string;
    overlapRatioSetting: string;
    grainSizeSetting: string;
    audioSourcesSetting: string;

    constructor() {
        this.spectrumFFTSize   = 128;
        this.spectrumSmoothing = 0.8;
        this.sonogramFFTSize   = 2048;
        this.sonogramSmoothing = 0;

        this.audioSourceIndex = 1;
        this.validGranSizes   = [256, 512, 1024, 2048, 4096, 8192];
        this.grainSizeKey     = 2;
        this.grainSize        = this.validGranSizes[this.grainSizeKey - 1];
        this.pitchRatio       = 1.0;
        this.overlapRatio     = 0.50;

        this.pitchRatioSetting = JSON.stringify({
            min : 0.5,
            max : 2,
            step: 0.01,
        });

        this.overlapRatioSetting = JSON.stringify({
            min : 0,
            max : 0.75,
            step: 0.01,
        });

        this.grainSizeSetting = JSON.stringify([
            {id: 1, active: false},
            {id: 2, active: false},
            {id: 3, active: false},
            {id: 4, active: false},
            {id: 5, active: false},
            {id: 6, active: false},
        ]);

        this.audioSourcesSetting = JSON.stringify([
            {id: 1, active: false},
            {id: 2, active: false},
        ]);
    }

    ngOnInit() {
        this.initAudio();
        this.initProcessor();
        // initSliders();
        // initCanvas();

        // window.requestAnimFrame(renderCanvas);
    }

    initAudio() {
        if (!navigator.getUserMedia) {
            alert('Your browser does not support the Media Stream API');
        } else {
            navigator.getUserMedia({audio: true, video: false},
                (stream: MediaStream) => {
                    this.audioSources[1] = this.audioContext.createMediaStreamSource(stream);
                },
                (error) => {
                    alert('Unable to get the user media');
                });
        }

        this.spectrumAudioAnalyser                       = this.audioContext.createAnalyser();
        this.spectrumAudioAnalyser.fftSize               = this.spectrumFFTSize;
        this.spectrumAudioAnalyser.smoothingTimeConstant = this.spectrumSmoothing;

        this.sonogramAudioAnalyser                       = this.audioContext.createAnalyser();
        this.sonogramAudioAnalyser.fftSize               = this.sonogramFFTSize;
        this.sonogramAudioAnalyser.smoothingTimeConstant = this.sonogramSmoothing;

        const bufferLoader2 = new bufferLoader(this.audioContext, ['/assets/audio/voice.mp3'], (bufferList: AudioBuffer) => {
            this.audioSources[0]        = this.audioContext.createBufferSource();
            this.audioSources[0].buffer = bufferList[0];
            this.audioSources[0].loop   = true;

            // Connectしないと音は出ない
            this.audioSources[0].connect(this.pitchShifterProcessor);
            this.audioSources[0].start(0);
        });

        bufferLoader2.load();
    }

    initProcessor() {
        if (this.pitchShifterProcessor) {
            this.pitchShifterProcessor.disconnect();
        }

        if (this.audioContext.createScriptProcessor) {
            this.pitchShifterProcessor = this.audioContext.createScriptProcessor(this.grainSize, 1, 1);
        }

        this.pitchShifterProcessor.buffer         = new Float32Array(this.grainSize * 2);
        this.pitchShifterProcessor.grainWindow    = this.hannWindow(this.grainSize);
        this.pitchShifterProcessor.onaudioprocess = (event) => {
            const inputData  = event.inputBuffer.getChannelData(0);
            const outputData = event.outputBuffer.getChannelData(0);

            for (let i = 0; i < inputData.length; i++) {

                // Apply the window to the input buffer
                inputData[i] *= this.pitchShifterProcessor.grainWindow[i];

                // Shift half of the buffer
                this.pitchShifterProcessor.buffer[i] = this.pitchShifterProcessor.buffer[i + this.grainSize];

                // Empty the buffer tail
                this.pitchShifterProcessor.buffer[i + this.grainSize] = 0.0;
            }

            // Calculate the pitch shifted grain re-sampling and looping the input
            const grainData = new Float32Array(this.grainSize * 2);
            for (let i = 0, j = 0.0;
                 i < this.grainSize;
                 i++, j += this.pitchRatio) {

                const index = Math.floor(j) % this.grainSize;
                const a     = inputData[index];
                const b     = inputData[(index + 1) % this.grainSize];
                grainData[i] += this.linearInterpolation(a, b, j % 1.0) * this.pitchShifterProcessor.grainWindow[i];
            }

            // Copy the grain multiple times overlapping it
            for (let i = 0; i < this.grainSize; i += Math.round(this.grainSize * (1 - this.overlapRatio))) {
                for (let j = 0; j <= this.grainSize; j++) {
                    this.pitchShifterProcessor.buffer[i + j] += grainData[j];
                }
            }

            // Output the first half of the buffer
            for (let i = 0; i < this.grainSize; i++) {
                outputData[i] = this.pitchShifterProcessor.buffer[i];
            }
        };

        this.pitchShifterProcessor.connect(this.spectrumAudioAnalyser);
        this.pitchShifterProcessor.connect(this.sonogramAudioAnalyser);
        this.pitchShifterProcessor.connect(this.audioContext.destination);
    }

    hannWindow(length) {
        const window = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (length - 1)));
        }
        return window;
    }

    linearInterpolation(a, b, t) {
        return a + (b - a) * t;
    }

    changePitchRatio(val) {
        const value = val.detail.value;
        if (value) {
            this.pitchRatio = value;
        }
    }

    changeOverlapRatio(val) {
        const value = val.detail.value;
        if (value) {
            this.overlapRatio = value;
        }
    }

    changeGrainSize(val) {
        const value = val.detail.value;
        if (value) {
            this.grainSize = this.validGranSizes[value - 1];
        }

        this.initProcessor();

        if (this.audioSources[this.audioSourceIndex - 1]) {
            this.audioSources[this.audioSourceIndex - 1].connect(this.pitchShifterProcessor);
        }
    }

    changeAudioSource(val) {
        const value = val.detail.value;
        if (value) {
            if (this.audioSources[this.audioSourceIndex - 1]) {
                this.audioSources[this.audioSourceIndex - 1].disconnect();
            }

            this.audioSourceIndex = value;

            if (this.audioSources[this.audioSourceIndex - 1]) {
                this.audioSources[this.audioSourceIndex - 1].connect(this.pitchShifterProcessor);
            }
        }
    }
}
