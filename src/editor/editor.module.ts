import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorComponent} from "./editor.component";
import {DiagramAllModule, DiagramModule} from "@syncfusion/ej2-angular-diagrams";


@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    DiagramAllModule,
    DiagramModule,
  ],
  exports: [EditorComponent]
})
export class EditorModule {
}
