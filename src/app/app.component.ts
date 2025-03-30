import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EditorComponent} from "@app/features/editor/features/editor/editor.component";


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, EditorComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KEMLeditor';
}
