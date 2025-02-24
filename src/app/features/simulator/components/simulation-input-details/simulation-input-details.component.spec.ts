import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulationInputDetails } from './simulation-input-details.component';
import {MatDialogRef} from "@angular/material/dialog";

describe('TrustDefaultDetailsComponent', () => {
  let component: SimulationInputDetails;
  let fixture: ComponentFixture<SimulationInputDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: {} },
      ],
      imports: [SimulationInputDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationInputDetails);
    component = fixture.componentInstance;
    component.simulationInputs = {defaultsPerCp: new Map()}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
