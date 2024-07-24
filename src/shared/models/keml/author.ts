import {LifeLine} from "./life-line";
import {Message} from "./message";

export class Author extends LifeLine{
  // todo why not? eClass = "http://www.unikoblenz.de/keml#//Author",
  messages: Message[];

  constructor(name = 'Author') {
    super(name);
    this.messages = [];
  }

}
