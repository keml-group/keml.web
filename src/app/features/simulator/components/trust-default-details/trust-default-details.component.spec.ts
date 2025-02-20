import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustDefaultDetailsComponent } from './trust-default-details.component';

describe('TrustDefaultDetailsComponent', () => {
  let component: TrustDefaultDetailsComponent;
  let fixture: ComponentFixture<TrustDefaultDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustDefaultDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrustDefaultDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
