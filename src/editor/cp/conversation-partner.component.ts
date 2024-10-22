import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ConversationPartner} from "../../shared/models/sequence-diagram-models";

@Component({
  selector: '[cp]',
  templateUrl: './conversation-partner.component.svg',
  styleUrl: './conversation-partner.component.css'
})
export class ConversationPartnerComponent {
  @Input() conversationPartner!: ConversationPartner;
  @Output() openDetails: EventEmitter<ConversationPartner> = new EventEmitter();

  openCpDetails() {
    this.openDetails.emit(this.conversationPartner);
  }

}
