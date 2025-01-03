import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorComponent} from "./editor.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {ConversationPartnerComponent} from "./cp/conversation-partner.component";
import { FormsModule } from '@angular/forms';
import {PersonSvgComponent} from "./person-svg/person-svg.component";
import {AuthorComponent} from "./author/author.component";
import {MsgComponent} from "./msg/msg.component";
import {InfoComponent} from "./info/info.component";
import {DatabaseSvgComponent} from "./database-svg/database-svg.component";
import {MsgDetailsComponent} from "./details/msg-details/msg-details.component";
import {ConversationPartnerDetailsComponent} from "./details/cp-details/cp-details.component";
import {InfoDetailsComponent} from "./info-details/info-details.component";
import {IsInstrSvgComponent} from "./is-instr-svg/is-instr-svg.component";
import {PreknowledgeComponent} from "./preknowledge/preknowledge.component";
import {TextAreaSvgComponent} from "./text-area-svg/text-area-svg.component";
import {ArrowSvgComponent} from "./arrow-svg/arrow-svg.component";
import {NewInfoComponent} from "./new-info/new-info.component";
import {InformationLinkComponent} from "./information-link/information-link.component";
import {InformationLinkDetailsComponent} from "./details/information-link-details/information-link-details.component";
import {InfoChoiceComponent} from "./info-choice/info-choice.component";
import {InfoInnerComponent} from "./info-inner/info-inner.component";


@NgModule({
  declarations: [
    ArrowSvgComponent,
    EditorComponent,
    ConversationPartnerComponent,
    ConversationPartnerDetailsComponent,
    PersonSvgComponent,
    DatabaseSvgComponent,
    AuthorComponent,
    MsgComponent,
    MsgDetailsComponent,
    IsInstrSvgComponent,
    InfoChoiceComponent,
    InfoComponent,
    InfoDetailsComponent,
    NewInfoComponent,
    InfoInnerComponent,
    InformationLinkComponent,
    InformationLinkDetailsComponent,
    PreknowledgeComponent,
    TextAreaSvgComponent,
  ],
  imports: [
    CommonModule,
    MatToolbar,
    MatIcon,
    FormsModule, //for two-way-binding
  ],
  exports: [EditorComponent]
})
export class EditorModule {
}
