import {Component, Input} from '@angular/core';
import {Author} from "../../models/core/author";
import { TextAreaSvgComponent } from "ngx-svg-graphics";
import { PersonSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/person-svg/person-svg.component';

@Component({
    selector: '[authorG]',
    templateUrl: './author.component.svg',
    styleUrl: './author.component.css',
    imports: [PersonSvgComponent, TextAreaSvgComponent]
})
export class AuthorComponent {
  //author has fixed position and no way to change name (right now)
  @Input() author!: Author;


}
