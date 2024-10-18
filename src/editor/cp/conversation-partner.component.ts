import {Component, Input} from '@angular/core';
import {ConversationPartner} from "../../shared/models/sequence-diagram-models";

@Component({
  selector: '[cp]',
  templateUrl: './conversation-partner.component.svg',
  styleUrl: './conversation-partner.component.css'
})
export class ConversationPartnerComponent {
  @Input() conversationPartner!: ConversationPartner;

  activateCP() {
    console.log('activateCP');
  }

}
