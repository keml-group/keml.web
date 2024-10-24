import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Message, ReceiveMessage} from "../../shared/models/sequence-diagram-models";
import {Information, NewInformation} from "../../shared/models/knowledge-models";
import {LayoutHelper} from "../../shared/layout-helper";

@Component({
  selector: '[msgG]',
  templateUrl: './msg.component.svg',
  styleUrl: './msg.component.css'
})
export class MsgComponent {
  @Input() msg!: Message;
  @Output() openDetails: EventEmitter<Message> = new EventEmitter();
  @Output() openInfo = new EventEmitter<Information>();

  constructor() { }

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
    this.openDetails.emit(this.msg);
  }

  openInfoDetails(info: Information) {
    this.openInfo.emit(info);
  }
}
