import {Component, Input} from '@angular/core';
import {Message} from "../../../shared/models/keml/msg-info";

@Component({
  selector: '[msg-inner]',
  templateUrl: './msg-inner.component.svg',
  styleUrl: './msg-inner.component.css'
})
export class MsgInnerComponent {
  @Input() msg!: Message;
  @Input() length?: number = 50;

}
