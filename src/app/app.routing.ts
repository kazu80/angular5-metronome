import {RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
// import {MainComponent} from './component/stop-watch/main/main.component';
import {TopComponent} from './component/metronome/top/top.component';
// import {RecordingComponent} from './component/recording/recording/recording.component';

export const routing: ModuleWithProviders = RouterModule.forRoot([
    {path: '', component: TopComponent},
//    {path: 'stop-watch', component: MainComponent},
//    {path: 'recording', component: RecordingComponent},
]);


