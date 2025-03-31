import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";
import { MatTooltip } from '@angular/material/tooltip';
import {Information, Message, ReceiveMessage, SendMessage} from "@app/shared/keml/models/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {ModelIOService} from "@app/features/editor/services/model-io.service";
import { InfoChoiceComponent } from '@app/shared/keml/components/helper/choices/info-choice/info-choice.component';
import { InfoInnerComponent } from '@app/shared/keml/components/helper/info-inner/info-inner.component';


@Component({
    selector: 'msg-details',
    templateUrl: './msg-details.component.html',
    styleUrl: './msg-details.component.css',
    imports: [FormsModule, NgFor, MatIcon, NgIf, InfoInnerComponent, InfoChoiceComponent, MatTooltip]
})
export class MsgDetailsComponent implements OnInit {
  @Input() msg!: Message;
  @Output() openOtherDetails: EventEmitter<Message> = new EventEmitter<Message>();
 @Output() openInfoDetails: EventEmitter<Information> = new EventEmitter<Information>();

  cps: ConversationPartner[];
  sendMsg?: SendMessage;
  receiveMsg?: ReceiveMessage;

  changedTiming: number = 0;

  constructor(
    public dialogRef: MatDialogRef<MsgDetailsComponent>,
    public modelIOService: ModelIOService,
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
        this.dialogRef.close();
        this.openInfoDetails.emit(newInfo);
    }
  }

  chooseInfo(info: Information){
    this.openInfoDetails.emit(info)
  }

  repeatAnInfo(info: Information) {
    if (this.receiveMsg) {
      this.modelIOService.addRepetition(this.receiveMsg, info)
    }
  }

}
