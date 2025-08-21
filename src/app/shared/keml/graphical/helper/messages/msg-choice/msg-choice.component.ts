import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {KemlService} from "@app/shared/keml/core/keml.service";
import {Message, ReceiveMessage, SendMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {Author} from "@app/shared/keml/core/author";
import { MsgComponent } from '../../../msg/msg.component';
import { ConversationPartnerComponent } from '../../../cp/conversation-partner.component';
import { AuthorComponent } from '../../../author/author.component';
import { MsgOverviewComponent } from '../msg-overview/msg-overview.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'msg-choice',
    templateUrl: './msg-choice.component.html',
    styleUrl: './msg-choice.component.css',
    imports: [NgIf, MsgOverviewComponent, AuthorComponent, NgFor, ConversationPartnerComponent, MsgComponent]
})
export class MsgChoiceComponent {

  @ViewChild('choosemsg') modalRef!: TemplateRef<any>;
  @Input() showMsg = true;
  @Input() isSend = false;
  @Input() sendMsg?: SendMessage;
  @Output() sendMsgChange = new EventEmitter<SendMessage>();
  @Input() receiveMsg?: ReceiveMessage;
  @Output() receiveMsgChange = new EventEmitter<ReceiveMessage>();

  sends: SendMessage[] = [];
  receives: ReceiveMessage[] = [];
  cps: ConversationPartner[] = [];
  author: Author;
  dialogRef?: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    public kemlService: KemlService,
  ) {
    this.sends = this.kemlService.getSends();
    this.receives = this.kemlService.getReceives()
    this.author = this.kemlService.getAuthor();
    this.cps = this.kemlService.getConversationPartners()
  }

  openChoice(event: Event) {
    event.stopPropagation();
    this.dialogRef = this.dialog.open(this.modalRef,{})
  }

  chooseSend(s: Message) {
    let newSend = (s as SendMessage)
    this.sendMsg = newSend;
    this.sendMsgChange.emit(newSend);
    this.dialogRef?.close();
  }

  chooseReceive(r: Message) {
    let newRec = (r as ReceiveMessage)
    this.receiveMsg = newRec;
    this.receiveMsgChange.emit(newRec);
    this.dialogRef?.close();
  }
}
