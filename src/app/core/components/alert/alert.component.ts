import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'alert-component',
  imports: [
    MatIcon,
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  public message: string;

  constructor(
    msg: string,
    public dialogRef: MatDialogRef<AlertComponent>
  ) {
    this.message = msg;
  }
  
  closeMe(): void {
    this.dialogRef.close();
  }
}
