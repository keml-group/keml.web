import {LifeLine} from "./life-line";
import {Message} from "./message";
import {Author as AuthorJson} from "../sequence-diagram-models"
import {ConversationPartner} from "./conversation-partner";
import {Preknowledge} from "./preknowledge";

export class Author extends LifeLine{
  // todo necessary? eClass = "http://www.unikoblenz.de/keml#//Author",
  preknowledge: Preknowledge[];
  messages: Message[];

  constructor(name = 'Author', xPosition: number = 0, preknowledge: Preknowledge[] = [], messages: Message[] = []) {
    super(name, xPosition);
    this.preknowledge = preknowledge;
    this.messages = messages;
  }

  static fromJson(author: AuthorJson, convPartners: ConversationPartner[]): Author {

    let preknowledge = author.preknowledge.map(pre => Preknowledge.fromJSON(pre))
    let msgs = author.messages.map(message => Message.fromJSON(message, convPartners))

    return new Author(author.name, author.xPosition, preknowledge, msgs) //todo
  }

}
