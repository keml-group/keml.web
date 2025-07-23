import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";
import { MatTooltip } from '@angular/material/tooltip';
import {Information, Message, ReceiveMessage, SendMessage} from "@app/shared/keml/models/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {KemlService} from "@app/features/editor/services/keml.service";
import { InfoChoiceComponent } from '@app/shared/keml/components/helper/choices/info-choice/info-choice.component';
import { InfoInnerComponent } from '@app/shared/keml/components/helper/info-inner/info-inner.component';
import {InputHandler} from "@app/core/utils/input-handler";


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


  constructor(
    public dialogRef: MatDialogRef<MsgDetailsComponent>,
    public kemlService: KemlService,
  ) {
    this.cps = this.kemlService.getConversationPartners();
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

  deleteMe() {
    this.kemlService.deleteMessage(this.msg);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newM = this.kemlService.duplicateMessage(this.msg);
    if (newM) {
      this.dialogRef.close();
      this.openOtherDetails.emit(newM);
    }
  }

  handleTimingChange(event: Event) {
    const value = InputHandler.getNewValueFromEvent(event)
    this.kemlService.changeMessagePos(this.msg, value);
  }
  
  addNewInfo() {
    if (this.receiveMsg) {
      const newInfo = this.kemlService.addNewNewInfo(this.receiveMsg)
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
      this.kemlService.addRepetition(this.receiveMsg, info)
    }
  }

}
