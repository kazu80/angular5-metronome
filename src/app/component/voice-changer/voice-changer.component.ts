import {Component, OnInit} from '@angular/core';
import bufferLoader from './buffer-loader';

@Component({
    selector   : 'app-voice-changer',
    templateUrl: './voice-changer.component.html',
    styleUrls  : ['./voice-changer.component.css']
})
export class VoiceChangerComponent implements OnInit {
    audioContext: AudioContext                 = new AudioContext();
    audioSources: Array<AudioBufferSourceNode> = [];
    spectrumAudioAnalyser: AnalyserNode;
    sonogramAudioAnalyser: AnalyserNode;

    private spectrumFFTSize: number;
    private spectrumSmoothing: number;
    private sonogramFFTSize: number;
    private sonogramSmoothing: number;

    constructor() {
        this.spectrumFFTSize   = 128;
        this.spectrumSmoothing = 0.8;
        this.sonogramFFTSize   = 2048;
        this.sonogramSmoothing = 0;
    }

    ngOnInit() {
        this.initAudio();
        // initProcessor();
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
            // this.audioSources[0].connect(pitchShifterProcessor);
            this.audioSources[0].start(0);

            console.log(this.audioSources);
        });

        bufferLoader2.load();
    }

}
