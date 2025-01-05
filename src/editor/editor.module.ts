import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorComponent} from "./editor.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {ConversationPartnerComponent} from "./cp/conversation-partner.component";
import { FormsModule } from '@angular/forms';
import {PersonSvgComponent} from "./helper/person-svg/person-svg.component";
import {AuthorComponent} from "./author/author.component";
import {MsgComponent} from "./msg/msg.component";
import {InfoComponent} from "./info/info.component";
import {DatabaseSvgComponent} from "./helper/database-svg/database-svg.component";
import {MsgDetailsComponent} from "./details/msg-details/msg-details.component";
import {ConversationPartnerDetailsComponent} from "./details/cp-details/cp-details.component";
import {InfoDetailsComponent} from "./details/info-details/info-details.component";
import {IsInstrSvgComponent} from "./helper/is-instr-svg/is-instr-svg.component";
import {PreknowledgeComponent} from "./preknowledge/preknowledge.component";
import {TextAreaSvgComponent} from "./helper/text-area-svg/text-area-svg.component";
import {ArrowSvgComponent} from "./helper/arrow-svg/arrow-svg.component";
import {NewInfoComponent} from "./new-info/new-info.component";
import {InformationLinkComponent} from "./information-link/information-link.component";
import {InformationLinkDetailsComponent} from "./details/information-link-details/information-link-details.component";
import {InfoChoiceComponent} from "./helper/info-choice/info-choice.component";
import {InfoInnerComponent} from "./helper/info-inner/info-inner.component";
import {MsgChoiceComponent} from "./helper/msg-choice/msg-choice.component";


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
    MsgChoiceComponent,
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
