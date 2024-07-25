import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorComponent} from "./editor.component";
import {DiagramAllModule, DiagramModule} from "@syncfusion/ej2-angular-diagrams";
import {ToolbarAllModule} from "@syncfusion/ej2-angular-navigations";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";


@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    DiagramAllModule,
    DiagramModule,
    ToolbarAllModule,
    MatToolbar,
    MatIcon,
  ],
  exports: [EditorComponent]
})
export class EditorModule {
}
