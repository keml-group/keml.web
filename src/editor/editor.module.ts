import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorComponent} from "./editor.component";
import {DiagramAllModule, DiagramModule} from "@syncfusion/ej2-angular-diagrams";
import {ToolbarAllModule} from "@syncfusion/ej2-angular-navigations";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {ConversationPartnerComponent} from "./cp/conversation-partner.component";
import { FormsModule } from '@angular/forms';
import {PersonSvgComponent} from "./person-svg/person-svg.component";
import {AuthorComponent} from "./author/author.component";
import {MsgComponent} from "./msg/msg.component";
import {InfoComponent} from "./info/info.component";
import {DatabaseSvgComponent} from "./database-svg/database-svg.component";
import {MsgDetailsComponent} from "./msg-details/msg-details.component";
import {ConversationPartnerDetailsComponent} from "./cp-details/cp-details.component";


@NgModule({
  declarations: [
    EditorComponent,
    ConversationPartnerComponent,
    ConversationPartnerDetailsComponent,
    PersonSvgComponent,
    DatabaseSvgComponent,
    AuthorComponent,
    MsgComponent,
    MsgDetailsComponent,
    InfoComponent,
  ],
  imports: [
    CommonModule,
    DiagramAllModule,
    DiagramModule,
    ToolbarAllModule,
    MatToolbar,
    MatIcon,
    FormsModule, //for two-way-binding
  ],
  exports: [EditorComponent]
})
export class EditorModule {
}
