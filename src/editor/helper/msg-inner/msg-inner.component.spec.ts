import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgInnerComponent } from './msg-inner.component';

describe('MsgInnerComponent', () => {
  let component: MsgInnerComponent;
  let fixture: ComponentFixture<MsgInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MsgInnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
