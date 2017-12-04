import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VoiceChangerComponent} from './voice-changer.component';

describe('VoiceChangerComponent', () => {
    let component: VoiceChangerComponent;
    let fixture: ComponentFixture<VoiceChangerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VoiceChangerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture   = TestBed.createComponent(VoiceChangerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
