import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpFormComponent } from './cp-form.component';

describe('MsgFormComponent', () => {
  let component: CpFormComponent;
  let fixture: ComponentFixture<CpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
