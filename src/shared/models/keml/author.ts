import {LifeLine} from "./life-line";

export class Author extends LifeLine{
  // todo why not? eClass = "http://www.unikoblenz.de/keml#//Author",

  constructor(name = 'Author') {
    super(name);
  }

}
