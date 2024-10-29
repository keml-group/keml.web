import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Message} from "../../shared/models/keml/message";
import {ConversationPartner} from "../../shared/models/keml/conversation-partner";
import {ModelIOService} from "../../shared/services/model-io.service";

@Component({
  selector: 'msg-details',
  templateUrl: './msg-details.component.html',
  styleUrl: './msg-details.component.css'
})
export class MsgDetailsComponent {
  @Input() msg!: Message;
  @Input() msgs!: Message[];
  @Input() cps!: ConversationPartner[];
  @Output() openOtherDetails = new EventEmitter<Message>();

  constructor(
    public dialogRef: MatDialogRef<MsgDetailsComponent>,
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
