import {Component, EventEmitter, Input, Output} from '@angular/core';
import { TextAreaSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/text-area-svg/text-area-svg.component';
import { PersonSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/person-svg/person-svg.component';
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";

@Component({
    selector: '[cp]',
    templateUrl: './conversation-partner.component.svg',
    styleUrl: './conversation-partner.component.css',
    imports: [PersonSvgComponent, TextAreaSvgComponent]
})
export class ConversationPartnerComponent {
  @Input() conversationPartner!: ConversationPartner;
  @Output() openDetails: EventEmitter<ConversationPartner> = new EventEmitter();

  openCpDetails() {
    this.openDetails.emit(this.conversationPartner);
  }

}
