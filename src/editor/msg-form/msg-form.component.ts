import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'msg-form',
  templateUrl: './msg-form.component.html',
  styleUrl: './msg-form.component.css'
})
export class MsgFormComponent {
  constructor(public dialogRef: MatDialogRef<MsgFormComponent>) { }

  onClose(): void {
    this.dialogRef.close();
  }

}
