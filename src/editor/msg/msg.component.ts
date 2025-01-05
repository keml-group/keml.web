import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Message} from "../../shared/models/keml/msg-info";
import {ReceiveMessage} from "../../shared/models/keml/msg-info";
import {Information} from "../../shared/models/keml/msg-info";
import {NewInformation} from "../../shared/models/keml/msg-info";
import {LayoutHelper} from "../../shared/utility/layout-helper";

@Component({
  selector: '[msgG]',
  templateUrl: './msg.component.svg',
  styleUrl: './msg.component.css'
})
export class MsgComponent {
  @Input() msg!: Message;
  @Output() chooseMsg: EventEmitter<Message> = new EventEmitter();
  @Output() chooseInfo = new EventEmitter<Information>();

  constructor() { }

  computeY(): number {
    return LayoutHelper.computeMessageY(this.msg.timing);
  }

  getInfos(): NewInformation[] {
    if (this.msg.isSend())
      return [];
    else {
      return (this.msg as ReceiveMessage).generates
    }
  }

  clickMsg() {
    this.chooseMsg.emit(this.msg);
  }

  clickInfo(info: Information) {
    this.chooseInfo.emit(info);
  }
}
