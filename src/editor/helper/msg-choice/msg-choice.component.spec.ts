import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgChoiceComponent } from './msg-choice.component';

describe('MsgChoiceComponent', () => {
  let component: MsgChoiceComponent;
  let fixture: ComponentFixture<MsgChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsgChoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MsgChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
