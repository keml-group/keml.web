import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationInputDetails } from './simulation-input-details.component';

describe('TrustDefaultDetailsComponent', () => {
  let component: SimulationInputDetails;
  let fixture: ComponentFixture<SimulationInputDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationInputDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationInputDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
