import {LifeLine} from "./life-line";

export class Author implements LifeLine{
  // todo why not? eClass = "http://www.unikoblenz.de/keml#//Author",
  name: string;


  constructor(name = 'Author') {
    this.name = name;
  }


}
