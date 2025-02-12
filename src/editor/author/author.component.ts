import {Component, Input} from '@angular/core';
import {Author} from "../../shared/models/keml/author";
import { TextAreaSvgComponent } from '../helper/text-area-svg/text-area-svg.component';
import { PersonSvgComponent } from '../helper/person-svg/person-svg.component';

@Component({
    selector: '[authorG]',
    templateUrl: './author.component.svg',
    styleUrl: './author.component.css',
    standalone: true,
    imports: [PersonSvgComponent, TextAreaSvgComponent]
})
export class AuthorComponent {
  //author has fixed position and no way to change name (right now)
  @Input() author!: Author;


}
