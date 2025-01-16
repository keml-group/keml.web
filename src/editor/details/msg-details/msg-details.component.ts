import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Information, Message, ReceiveMessage, SendMessage} from "../../../shared/models/keml/msg-info";
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

  changedTiming: number = 0;

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
    this.changedTiming = this.msg.timing
  }

  closeMe(): void {
    this.dialogRef.close();
  }

  moveUp() {
    this.modelIOService.moveMessageUp(this.msg);
    this.changedTiming = this.msg.timing
  }

  disableMoveUp(): boolean {
    return this.modelIOService.disableMoveUp(this.msg);
  }

  moveDown() {
    this.modelIOService.moveMessageDown(this.msg);
    this.changedTiming = this.msg.timing
  }

  disableMoveDown(): boolean {
    return this.modelIOService.disableMoveDown(this.msg)
  }

  handleTimingChange() {
    this.modelIOService.changeMessagePos(this.msg, this.changedTiming);
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

  repeatAnInfo(info: Information) {
    if (this.receiveMsg) {
      this.modelIOService.addRepetition(this.receiveMsg, info)
    }
  }

}
