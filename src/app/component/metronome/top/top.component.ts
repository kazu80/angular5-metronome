import {Component, OnInit} from '@angular/core';

@Component({
    selector   : 'app-top',
    templateUrl: './top.component.html',
    styleUrls  : ['./top.component.scss']
})
export class TopComponent implements OnInit {
    param: number;
    params: string;

    constructor() {
    }

    ngOnInit() {
        this.param  = 100;
        this.params = JSON.stringify({
            min : 1,
            max : 255,
            step: 1,
        });
    }

    change(val) {
        const value = val.detail.value;
        if (value) {
            console.log(value);
        }
    }

}
