import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EditorComponent} from "@app/features/editor/features/editor/editor.component";
import {ArrowStyleConfigurationService} from "@app/core/features/arrows/services/arrow-style-configuration.service";
import {KEMLArrowStyleConfigurationService} from "@app/shared/keml/services/kemlarrow-style-configuration.service";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditorComponent],
  providers: [{ provide: ArrowStyleConfigurationService, useClass: KEMLArrowStyleConfigurationService }],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'KEMLeditor';
}
