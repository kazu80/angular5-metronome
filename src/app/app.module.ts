import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {routing} from './app.routing';

import {AppComponent} from './component/app/app.component';
import {TopComponent} from './component/metronome/top/top.component';
import {VoiceChangerComponent} from './component/voice-changer/voice-changer.component';
import {SpeechComponent} from './component/metronome/speech/speech.component';

@NgModule({
    declarations: [
        AppComponent,
        TopComponent,
        VoiceChangerComponent,
        SpeechComponent
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
