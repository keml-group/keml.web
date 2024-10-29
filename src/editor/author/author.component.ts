import {Component, Input} from '@angular/core';
import {Author} from "../../shared/models/keml/author";

@Component({
  selector: '[authorG]',
  templateUrl: './author.component.svg',
  styleUrl: './author.component.css'
})
export class AuthorComponent {
  //author has fixed position and no way to change name (right now)
  @Input() author!: Author;


}
