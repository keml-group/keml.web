import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ConversationPartner} from "../../shared/models/keml/conversation-partner";
import { TextAreaSvgComponent } from '../helper/text-area-svg/text-area-svg.component';
import { PersonSvgComponent } from '../helper/person-svg/person-svg.component';

@Component({
    selector: '[cp]',
    templateUrl: './conversation-partner.component.svg',
    styleUrl: './conversation-partner.component.css',
    standalone: true,
    imports: [PersonSvgComponent, TextAreaSvgComponent]
})
export class ConversationPartnerComponent {
  @Input() conversationPartner!: ConversationPartner;
  @Output() openDetails: EventEmitter<ConversationPartner> = new EventEmitter();

  openCpDetails() {
    this.openDetails.emit(this.conversationPartner);
  }

}
