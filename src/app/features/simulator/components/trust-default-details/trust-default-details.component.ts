import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'trust-default-details',
  standalone: true,
  imports: [],
  templateUrl: './trust-default-details.component.html',
  styleUrl: './trust-default-details.component.css'
})
export class TrustDefaultDetailsComponent {

  constructor(
    private dialogRef: MatDialogRef<TrustDefaultDetailsComponent>,
  ) {}

  closeMe() {
    this.dialogRef.close();
  }
}
