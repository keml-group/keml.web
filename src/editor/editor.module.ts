import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CentralWindowComponent} from "./central-window/central-window.component";
import {EditorComponent} from "./editor.component";


@NgModule({
  declarations: [CentralWindowComponent, EditorComponent],
  imports: [
    CommonModule
  ],
  exports: [EditorComponent]
})
export class EditorModule {
}
