import {Component, Input} from '@angular/core';
import {Message} from "../../../shared/models/keml/msg-info";

@Component({
  selector: '[msg-overview]',
  templateUrl: './msg-overview.component.svg',
  styleUrl: './msg-overview.component.css'
})
export class MsgOverviewComponent {
  @Input() msg!: Message;

}
