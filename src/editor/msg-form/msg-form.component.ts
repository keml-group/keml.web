import {Component, Input} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Message} from "../../shared/models/sequence-diagram-models";

@Component({
  selector: 'msg-form',
  templateUrl: './msg-form.component.html',
  styleUrl: './msg-form.component.css'
})
export class MsgFormComponent {
  @Input() msg!: Message;

  constructor(public dialogRef: MatDialogRef<MsgFormComponent>) { }

  onClose(): void {
    console.log(this.msg.timing);
    this.dialogRef.close();
  }

  moveUp() {

  }

  disableMoveUp(): boolean {
    return this.msg.timing<=1;
  }

  moveDown() {

  }

  disableMoveDown(): boolean {
    return this.msg.timing>=1; //todo need length -> service?
  }

}
