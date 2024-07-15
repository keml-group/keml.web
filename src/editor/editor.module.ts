import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorComponent} from "./editor.component";
import {DiagramAllModule, DiagramModule} from "@syncfusion/ej2-angular-diagrams";
import {ToolbarAllModule} from "@syncfusion/ej2-angular-navigations";


@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    DiagramAllModule,
    DiagramModule,
    ToolbarAllModule,
  ],
  exports: [EditorComponent]
})
export class EditorModule {
}
