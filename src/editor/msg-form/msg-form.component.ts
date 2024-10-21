import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ConversationPartner, Message} from "../../shared/models/sequence-diagram-models";
import {ModelIOService} from "../../shared/services/model-io.service";

@Component({
  selector: 'msg-form',
  templateUrl: './msg-form.component.html',
  styleUrl: './msg-form.component.css'
})
export class MsgFormComponent {
  @Input() msg!: Message;
  @Input() msgs!: Message[];
  @Input() cps!: ConversationPartner[];
  @Output() openOtherDetails = new EventEmitter<Message>();

  constructor(
    public dialogRef: MatDialogRef<MsgFormComponent>,
    public modelIOService: ModelIOService,
  ) { }

  closeMe(): void {
    console.log(this.msg.timing);
    this.dialogRef.close();
  }

  moveUp() {
    this.modelIOService.moveMessageUp(this.msg, this.msgs);
  }

  disableMoveUp(): boolean {
    return this.modelIOService.disableMoveUp(this.msg);
  }

  moveDown() {
    this.modelIOService.moveMessageDown(this.msg, this.msgs);
  }

  disableMoveDown(): boolean {
    return this.modelIOService.disableMoveDown(this.msg, this.msgs)
  }

  deleteMe() {
    this.modelIOService.deleteMessage(this.msg, this.msgs);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newM = this.modelIOService.duplicateMessage(this.msg, this.msgs);
    if (newM) {
      this.dialogRef.close();
      this.openOtherDetails.emit(newM);
    }
  }

}
