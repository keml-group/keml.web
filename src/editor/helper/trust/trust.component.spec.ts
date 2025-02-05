import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustComponent } from './trust.component';

describe('TrustComponent', () => {
  let component: TrustComponent;
  let fixture: ComponentFixture<TrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should produce red', () => {
    component.trust = -1.0
    expect(component.computeColor()).toEqual('#ff0000')
  })

  it('should produce green', () => {
    component.trust = 1.0
    expect(component.computeColor()).toEqual('#00ff00')
  })
});
