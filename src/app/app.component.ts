import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EditorComponent} from "@app/features/editor/components/editor/editor.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KEMLeditor';
}
