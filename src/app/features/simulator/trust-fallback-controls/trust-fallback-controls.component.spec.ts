import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogRef} from "@angular/material/dialog";
import {TrustFallbacks} from "@app/features/simulator/trust-fallbacks";
import {TrustFallbackControls} from "@app/features/simulator/trust-fallback-controls/trust-fallback-controls.component";

describe('TrustFallbackControls', () => {
  let component: TrustFallbackControls;
  let fixture: ComponentFixture<TrustFallbackControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: {} },
      ],
      imports: [TrustFallbackControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustFallbackControls);
    component = fixture.componentInstance;
    component.trustFallbacks = new TrustFallbacks()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
