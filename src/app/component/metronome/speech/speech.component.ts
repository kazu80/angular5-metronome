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
    isSpeak: boolean;
    speakText: string;

    constructor(el: ElementRef) {
        this._el = el.nativeElement;

        this.sound_file  = '/assets/audio/beep.wav';
        this.isPlaySound = false;
        this.isSpeak     = false;
        this.speakText   = '';
    }

    ngOnInit() {
        const voiceButton = this._el.querySelector('#voice-button');
        const voicePlayer = this._el.querySelector('#voice-player');

        voicePlayer.addEventListener('end', () => {
            this.isSpeak = false;
        });

        voiceButton.addEventListener('onSpeech', (voiceEvent: any) => {
            if (voiceEvent.detail.isFinal) {
                this.speechResult = voiceEvent.detail.speechResult;

                switch (voiceEvent.detail.speechResult) {
                    case 'metronome':
                        this.speakText = 'はい、わたしです。';
                        this.isSpeak   = true;
                        break;

                    case 'OK Google':
                        this.speakText = '誰かと間違っていませんか？わたしは、メトロノームです';
                        this.isSpeak   = true;
                        break;

                    case 'up-tempo':
                        this.speakText = 'テンポをアップしました。';
                        this.isSpeak   = true;
                        break;

                    default:
                        this.speakText = 'すみません。よくわかりません';
                        this.isSpeak   = true;
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

        voiceButton.addEventListener('click', () => {
            // response sound
            this.isPlaySound = true;
        });
    }
}
