import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector   : 'app-speech',
    templateUrl: './speech.component.html',
    styleUrls  : ['./speech.component.scss']
})
export class SpeechComponent implements OnInit {
    @Output() tempoUp       = new EventEmitter<boolean>();
    @Output() tempoDown     = new EventEmitter<boolean>();
    @Output() metronomePlay = new EventEmitter<boolean>();
    @Output() metronomeStop = new EventEmitter<boolean>();
    @Output() beatUp        = new EventEmitter<boolean>();
    @Output() beatDown      = new EventEmitter<boolean>();

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
                        this.tempoUp.emit(true);
                        break;

                    case 'downtempo':
                        this.speakText = 'テンポを下げました。';
                        this.isSpeak   = true;
                        this.tempoDown.emit(true);
                        break;

                    case 'beat up':
                        this.speakText = 'ビードを上げました。';
                        this.isSpeak   = true;
                        this.beatUp.emit(true);
                        break;

                    case 'beatdown':
                        this.speakText = 'ビードを下げました。';
                        this.isSpeak   = true;
                        this.beatDown.emit(true);
                        break;

                    case 'Gray':
                    case 'today':
                    case 'play':
                        this.speakText = 'メトロノームはじめます';
                        this.isSpeak   = true;
                        setTimeout(() => {
                            this.metronomePlay.emit(true);
                        }, 1500);
                        break;

                    case 'stop':
                        this.metronomeStop.emit(true);

                        setTimeout(() => {
                            this.speakText = 'メトロノームを止めました';
                            this.isSpeak   = true;
                        }, 500);
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
