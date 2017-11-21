import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {routing} from './app.routing';

import {AppComponent} from './component/app/app.component';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        routing
    ],
    providers   : [],
    bootstrap   : [AppComponent],
    schemas     : [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
