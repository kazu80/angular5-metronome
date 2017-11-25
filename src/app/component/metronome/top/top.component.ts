import {Component, OnInit} from '@angular/core';

@Component({
    selector   : 'app-top',
    templateUrl: './top.component.html',
    styleUrls  : ['./top.component.scss']
})
export class TopComponent implements OnInit {
    tempo: number;
    tempos: string;
    beat: number;
    beats: string;

    constructor() {
    }

    ngOnInit() {
        this.tempo  = 100;
        this.tempos = JSON.stringify({
            min : 1,
            max : 255,
            step: 1,
        });
        this.beat   = 4;
        this.beats  = JSON.stringify([
            {id: 1, active: false},
            {id: 2, active: false},
            {id: 3, active: false},
            {id: 4, active: false},
            {id: 5, active: false},
            {id: 6, active: false},
            {id: 7, active: false},
            {id: 8, active: false},
        ]);
    }

    changeTempo(val) {
        const value = val.detail.value;
        if (value) {
            // console.log(value);
        }
    }

}
