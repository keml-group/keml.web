import {Component, Input} from '@angular/core';
import {Message} from "../../shared/models/sequence-diagram-models";

@Component({
  selector: '[msgG]',
  templateUrl: './msg.component.svg',
  styleUrl: './msg.component.css'
})
export class MsgComponent {
  @Input() msg!: Message;


}
