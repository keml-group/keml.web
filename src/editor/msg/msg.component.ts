import {Component, Input} from '@angular/core';
import {ConversationPartner, Message, ReceiveMessage} from "../../shared/models/sequence-diagram-models";
import {NewInformation} from "../../shared/models/knowledge-models";
import {LayoutHelper} from "../../shared/layout-helper";
import {MsgFormComponent} from "../msg-form/msg-form.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: '[msgG]',
  templateUrl: './msg.component.svg',
  styleUrl: './msg.component.css'
})
export class MsgComponent {
  @Input() msg!: Message;
  @Input() msgs!: Message[];
  @Input() cps!: ConversationPartner[];


  constructor(private dialog: MatDialog) { }

  computeY(): number {
    return LayoutHelper.computeMessageY(this.msg.timing);
  }

  isSend(): boolean {
    return this.msg.eClass.endsWith('SendMessage')
  }

  getInfos(): NewInformation[] {
    if (this.isSend())
      return [];
    else {
      return (this.msg as ReceiveMessage).generates
    }
  }

  openMessageDetails() {
    console.log('Activate Message');
    const dialogRef = this.dialog.open(
      MsgFormComponent,
      {width: '40%', height: '80%'}
    );
    dialogRef.componentInstance.msg = this.msg;
    dialogRef.componentInstance.msgs = this.msgs;
    dialogRef.componentInstance.cps = this.cps;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do something
      }
    });
  }
}
