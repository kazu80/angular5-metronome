import {RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
// import {MainComponent} from './component/stop-watch/main/main.component';
import {TopComponent} from './component/metronome/top/top.component';
// import {RecordingComponent} from './component/recording/recording/recording.component';
import {VoiceChangerComponent} from './component/voice-changer/voice-changer.component';

export const routing: ModuleWithProviders = RouterModule.forRoot([
    {path: '', component: TopComponent},
    {path: 'voice-changer', component: VoiceChangerComponent},
//    {path: 'recording', component: RecordingComponent},
]);


