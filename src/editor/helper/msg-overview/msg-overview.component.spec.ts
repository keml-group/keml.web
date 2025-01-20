import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgOverviewComponent } from './msg-overview.component';

describe('MsgOverviewComponent', () => {
  let component: MsgOverviewComponent;
  let fixture: ComponentFixture<MsgOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MsgOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
