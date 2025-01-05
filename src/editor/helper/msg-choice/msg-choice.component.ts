import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModelIOService} from "../../../shared/services/model-io.service";
import {Message, ReceiveMessage, SendMessage} from "../../../shared/models/keml/msg-info";

@Component({
  selector: 'msg-choice',
  templateUrl: './msg-choice.component.html',
  styleUrl: './msg-choice.component.css'
})
export class MsgChoiceComponent {

  @ViewChild('choosemsg') modalRef!: TemplateRef<any>;
  @Input() isSend = false;
  @Input() sendMsg?: SendMessage;
  @Output() sendMsgChange = new EventEmitter<SendMessage>();
  @Input() receiveMsg?: ReceiveMessage;
  @Output() receiveMsgChange = new EventEmitter<ReceiveMessage>();

  sends: SendMessage[] = [];
  receives: ReceiveMessage[] = [];
  dialogRef?: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    public modelIOService: ModelIOService,
  ) {
    this.sends = this.modelIOService.getSends();
    this.receives = this.modelIOService.getReceives()
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
