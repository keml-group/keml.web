import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsInstrSvgComponent } from './is-instr-svg.component';

describe('IsInstrSvgComponent', () => {
  let component: IsInstrSvgComponent;
  let fixture: ComponentFixture<IsInstrSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsInstrSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsInstrSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
