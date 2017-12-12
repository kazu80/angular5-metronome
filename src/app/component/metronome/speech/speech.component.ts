import {Component, ElementRef, OnInit} from '@angular/core';

@Component({
    selector   : 'app-speech',
    templateUrl: './speech.component.html',
    styleUrls  : ['./speech.component.scss']
})
export class SpeechComponent implements OnInit {
    private _el: HTMLElement;
            speechResult: string;


    constructor(el: ElementRef) {
        this._el = el.nativeElement;
    }

    ngOnInit() {
        const voiceButton = this._el.querySelector('#voice-button');

        voiceButton.addEventListener('onSpeech', (voiceEvent: any) => {
            if (voiceEvent.detail.isFinal) {
                this.speechResult = voiceEvent.detail.speechResult;

                switch (voiceEvent.detail.speechResult) {
                    case 'hello metronome':
                        console.log('ok!!');
                        break;
                }

            }
        });
    }

}
