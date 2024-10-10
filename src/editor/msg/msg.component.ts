import {Component, Input} from '@angular/core';
import {Message, ReceiveMessage} from "../../shared/models/sequence-diagram-models";
import {NewInformation} from "../../shared/models/knowledge-models";

@Component({
  selector: '[msgG]',
  templateUrl: './msg.component.svg',
  styleUrl: './msg.component.css'
})
export class MsgComponent {
  @Input() msg!: Message;

  computeY(): number {
    return 180+60*this.msg.timing;
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

}
