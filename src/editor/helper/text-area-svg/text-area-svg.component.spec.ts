import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaSvgComponent } from './text-area-svg.component';

describe('TextAreaSvgComponent', () => {
  let component: TextAreaSvgComponent;
  let fixture: ComponentFixture<TextAreaSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextAreaSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAreaSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
