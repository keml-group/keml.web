import {Component, EventEmitter, Input, Output} from '@angular/core';
import { TextAreaSvgComponent } from "ngx-svg-graphics";
import { PersonSvgComponent } from '@app/shared/keml/graphical/helper/person-svg/person-svg.component';
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

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
