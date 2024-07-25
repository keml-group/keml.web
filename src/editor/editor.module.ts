import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorComponent} from "./editor.component";
import {DiagramAllModule, DiagramModule} from "@syncfusion/ej2-angular-diagrams";
import {ToolbarAllModule} from "@syncfusion/ej2-angular-navigations";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {ConversationPartnerComponent} from "./conversation-partner/conversation-partner.component";
import {Cp2Component} from "./cp2/cp2.component";


@NgModule({
  declarations: [EditorComponent, Cp2Component],
  imports: [
    CommonModule,
    DiagramAllModule,
    DiagramModule,
    ToolbarAllModule,
    MatToolbar,
    MatIcon,
    ConversationPartnerComponent
  ],
  exports: [EditorComponent]
})
export class EditorModule {
}
