import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustSliderComponent } from './trust-slider.component';

describe('TrustSliderComponent', () => {
  let component: TrustSliderComponent;
  let fixture: ComponentFixture<TrustSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
