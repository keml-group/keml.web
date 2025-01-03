import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Message} from "../../shared/models/keml/msg-info";
import {ConversationPartner} from "../../shared/models/keml/conversation-partner";
import {ModelIOService} from "../../shared/services/model-io.service";

@Component({
  selector: 'msg-details',
  templateUrl: './msg-details.component.html',
  styleUrl: './msg-details.component.css'
})
export class MsgDetailsComponent {
  @Input() msg!: Message;
  @Input() cps!: ConversationPartner[];
  @Output() openOtherDetails = new EventEmitter<Message>();

  constructor(
    public dialogRef: MatDialogRef<MsgDetailsComponent>,
    public modelIOService: ModelIOService,
  ) { }

  closeMe(): void {
    this.dialogRef.close();
  }

  moveUp() {
    this.modelIOService.moveMessageUp(this.msg);
  }

  disableMoveUp(): boolean {
    return this.modelIOService.disableMoveUp(this.msg);
  }

  moveDown() {
    this.modelIOService.moveMessageDown(this.msg);
  }

  disableMoveDown(): boolean {
    return this.modelIOService.disableMoveDown(this.msg)
  }

  deleteMe() {
    this.modelIOService.deleteMessage(this.msg);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newM = this.modelIOService.duplicateMessage(this.msg);
    if (newM) {
      this.dialogRef.close();
      this.openOtherDetails.emit(newM);
    }
  }

}
