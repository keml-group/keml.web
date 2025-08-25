import {Component, input, Input, InputSignal} from '@angular/core';
import {Author} from "@app/shared/keml/core/author";
import { TextAreaSvgComponent } from "ngx-svg-graphics";
import { PersonSvgComponent } from '@app/shared/keml/graphical/helper/base-svg/person-svg/person-svg.component';

@Component({
    selector: '[authorG]',
    templateUrl: './author.component.svg',
    styleUrl: './author.component.css',
    imports: [PersonSvgComponent, TextAreaSvgComponent]
})
export class AuthorComponent {
  //author has fixed position and no way to change name (right now)
  @Input() author!: Author;
  lineLength: InputSignal<number> = input.required<number>()

  constructor() {
  }

}
