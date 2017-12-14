import {Component, ElementRef, OnInit} from '@angular/core';

@Component({
    selector   : 'app-speech',
    templateUrl: './speech.component.html',
    styleUrls  : ['./speech.component.scss']
})
export class SpeechComponent implements OnInit {
    private _el: HTMLElement;

    speechResult: string;
    sound_file: string;
    isPlaySound: boolean;

    constructor(el: ElementRef) {
        this._el = el.nativeElement;

        this.sound_file  = '/assets/audio/beep.wav';
        this.isPlaySound = false;
    }

    ngOnInit() {
        const voiceButton = this._el.querySelector('#voice-button');

        voiceButton.addEventListener('onSpeech', (voiceEvent: any) => {
            if (voiceEvent.detail.isFinal) {
                this.speechResult = voiceEvent.detail.speechResult;

                // response sound
                this.isPlaySound = true;

                switch (voiceEvent.detail.speechResult) {
                    case 'okay metronome':
                        break;

                    default:
                        break;
                }

            }
        });

        voiceButton.addEventListener('onStateChange', (latest: any) => {
            switch (latest.detail.newValue) {
                case 'listening':
                    this.speechResult = '';
                    this.isPlaySound  = false;
                    break;
                case 'user-input':
                    break;
                case 'idle':
                    break;
            }
        });
    }

}
