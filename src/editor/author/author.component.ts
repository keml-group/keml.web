import { Component } from '@angular/core';
import {Author} from "../../shared/models/keml/author";

@Component({
  selector: '[author]',
  templateUrl: './author.component.svg',
  styleUrl: './author.component.css'
})
export class AuthorComponent {
  //author has fixed position and no way to change name (right now)
  author: Author;

  constructor() {
    this.author = new Author();
  }

}
