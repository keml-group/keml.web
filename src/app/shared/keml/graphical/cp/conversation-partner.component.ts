import {Component, computed, EventEmitter, input, Input, InputSignal, Output, Signal} from '@angular/core';
import { TextAreaSvgComponent } from "ngx-svg-graphics";
import { PersonSvgComponent } from '@app/shared/keml/graphical/helper/base-svg/person-svg/person-svg.component';
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {KemlService} from "@app/shared/keml/core/keml.service";
import {LayoutingService} from "@app/shared/keml/graphical/layouting.service";

@Component({
    selector: '[cp]',
    templateUrl: './conversation-partner.component.svg',
    styleUrl: './conversation-partner.component.css',
    imports: [PersonSvgComponent, TextAreaSvgComponent]
})
export class ConversationPartnerComponent {
  @Input() conversationPartner!: ConversationPartner;
  @Output() openDetails: EventEmitter<ConversationPartner> = new EventEmitter();

  lineLength: Signal<number> = computed(() =>
    this.layoutingService.determineLifeLineLength(this.kemlService.msgCount()))

  constructor(
    private kemlService: KemlService,
    private layoutingService: LayoutingService,
    ) {
  }

  openCpDetails() {
    this.openDetails.emit(this.conversationPartner);
  }

  protected readonly LayoutingService = LayoutingService;
}
