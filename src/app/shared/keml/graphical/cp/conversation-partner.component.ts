import {Component, EventEmitter, input, Input, InputSignal, Output} from '@angular/core';
import { TextAreaSvgComponent } from "ngx-svg-graphics";
import { PersonSvgComponent } from '@app/shared/keml/graphical/helper/base-svg/person-svg/person-svg.component';
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {LayoutingService} from "@app/shared/keml/graphical/layouting.service";

@Component({
    selector: '[cp]',
    templateUrl: './conversation-partner.component.svg',
    styleUrl: './conversation-partner.component.css',
    imports: [PersonSvgComponent, TextAreaSvgComponent]
})
export class ConversationPartnerComponent {
  lineLength: InputSignal<number> = input.required<number>()
  @Input() conversationPartner!: ConversationPartner;
  @Output() openDetails: EventEmitter<ConversationPartner> = new EventEmitter();

  constructor() {
  }

  openCpDetails() {
    this.openDetails.emit(this.conversationPartner);
  }

  protected readonly LayoutingService = LayoutingService;
}
