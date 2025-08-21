import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulationInputDetails } from './simulation-input-details.component';
import {MatDialogRef} from "@angular/material/dialog";
import {SimulationInputs} from "@app/features/simulator/simulation-inputs";

describe('SimulationInputDetails', () => {
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
    component.simulationInputs = new SimulationInputs()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
