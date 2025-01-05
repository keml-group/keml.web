import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Message, ReceiveMessage, SendMessage} from "../../../shared/models/keml/msg-info";
import {ConversationPartner} from "../../../shared/models/keml/conversation-partner";
import {ModelIOService} from "../../../shared/services/model-io.service";
import {DetailsService} from "../service/details.service";

@Component({
  selector: 'msg-details',
  templateUrl: './msg-details.component.html',
  styleUrl: './msg-details.component.css'
})
export class MsgDetailsComponent implements OnInit {
  @Input() msg!: Message;
  @Output() openOtherDetails: EventEmitter<Message> = new EventEmitter<Message>();

  cps: ConversationPartner[];
  sendMsg?: SendMessage;
  receiveMsg?: ReceiveMessage;

  constructor(
    public dialogRef: MatDialogRef<MsgDetailsComponent>,
    public modelIOService: ModelIOService,
    public detailsService: DetailsService,
  ) {
    this.cps = this.modelIOService.getConversationPartners();
  }

  ngOnInit() {
    if (this.msg.isSend()) {
      this.sendMsg = (this.msg as SendMessage)
    } else {
      this.receiveMsg = (this.msg as ReceiveMessage)
    }
  }

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

  addNewInfo() {
    if (this.receiveMsg) {
      const newInfo = this.modelIOService.addNewNewInfo(this.receiveMsg)
      if (newInfo)
        this.detailsService.openInfoDetails(newInfo);
    }
  }

}
