import {Component, OnInit} from '@angular/core';

@Component({
    selector   : 'app-top',
    templateUrl: './top.component.html',
    styleUrls  : ['./top.component.scss']
})
export class TopComponent implements OnInit {
    tempo: number;
    tempos: string;

    constructor() {
    }

    ngOnInit() {
        this.tempo  = 100;
        this.tempos = JSON.stringify({
            min : 1,
            max : 255,
            step: 1,
        });
    }

    changeTempo(val) {
        const value = val.detail.value;
        if (value) {
            console.log(value);
        }
    }

}
