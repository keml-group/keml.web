import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EditorComponent} from "@app/features/editor/editor/editor.component";
import {NgTemplateOutlet} from "@angular/common";


@Component({
    selector: 'app-root',
  imports: [RouterOutlet, EditorComponent, NgTemplateOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KEML-Editor';

  hideAside: boolean = false;

  toggleAside() {
    this.hideAside = !this.hideAside;
  }
}
