import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'simulation-input-details',
  standalone: true,
  imports: [],
  templateUrl: './simulation-input-details.component.html',
  styleUrl: './simulation-input-details.component.css'
})
export class SimulationInputDetails {

  constructor(
    private dialogRef: MatDialogRef<SimulationInputDetails>,
  ) {}

  closeMe() {
    this.dialogRef.close();
  }
}
