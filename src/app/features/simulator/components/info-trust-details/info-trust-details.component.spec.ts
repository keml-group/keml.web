import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTrustDetailsComponent } from './info-trust-details.component';

describe('InfoTrustDetailsComponent', () => {
  let component: InfoTrustDetailsComponent;
  let fixture: ComponentFixture<InfoTrustDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoTrustDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoTrustDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
