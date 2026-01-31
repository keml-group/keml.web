import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsInstrSvgComponent } from './is-instr-svg.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Preknowledge} from "@app/shared/keml/core/msg-info";

describe('IsInstrSvgComponent', () => {
  let component: IsInstrSvgComponent;
  let fixture: ComponentFixture<IsInstrSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [IsInstrSvgComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(IsInstrSvgComponent);
    component = fixture.componentInstance;
    component.info = Preknowledge.create()

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
