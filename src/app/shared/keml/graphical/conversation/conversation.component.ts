import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ArrowMarkersComponent
} from "@app/shared/keml/graphical/helper/arrow-styling/arrow-markers/arrow-markers.component";
import {AuthorComponent} from "@app/shared/keml/graphical/author/author.component";
import {ConversationPartnerComponent} from "@app/shared/keml/graphical/cp/conversation-partner.component";
import {MsgComponent} from "@app/shared/keml/graphical/msg/msg.component";
import {NgForOf} from "@angular/common";
import {PreknowledgeComponent} from "@app/shared/keml/graphical/preknowledge/preknowledge.component";
import {TextAreaSvgComponent} from "ngx-svg-graphics";
import {Conversation} from "@app/shared/keml/core/conversation";
import {Information, InformationLink, Message} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

@Component({
  selector: '[convG]',
  imports: [
    ArrowMarkersComponent,
    AuthorComponent,
    ConversationPartnerComponent,
    MsgComponent,
    NgForOf,
    PreknowledgeComponent,
    TextAreaSvgComponent
  ],
  templateUrl: './conversation.component.svg',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent {

  @Input() conversation!: Conversation;
  @Input() showInfos = true;
  @Input() showInfoTrusts = false;
  @Output() chooseCp: EventEmitter<ConversationPartner> = new EventEmitter();
  @Output() chooseMsg: EventEmitter<Message> = new EventEmitter();
  @Output() chooseInfo = new EventEmitter<Information>();
  @Output() chooseInfoLink: EventEmitter<InformationLink> = new EventEmitter<InformationLink>()


}
