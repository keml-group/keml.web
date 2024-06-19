import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CentralWindowComponent} from "./central-window/central-window.component";
import {EditorComponent} from "./editor.component";
import {DiagramAllModule, DiagramModule} from "@syncfusion/ej2-angular-diagrams";


@NgModule({
  declarations: [CentralWindowComponent, EditorComponent],
  imports: [
    CommonModule,
    DiagramAllModule,
    DiagramModule,
  ],
  exports: [EditorComponent]
})
export class EditorModule {
}
