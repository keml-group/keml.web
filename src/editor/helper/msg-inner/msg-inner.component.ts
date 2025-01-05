import {Component, Input} from '@angular/core';
import {Message} from "../../../shared/models/keml/msg-info";

@Component({
  selector: 'app-msg-inner',
  templateUrl: './msg-inner.component.html',
  styleUrl: './msg-inner.component.css'
})
export class MsgInnerComponent {
  @Input() msg!: Message;

}
