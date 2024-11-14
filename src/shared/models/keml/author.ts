import {LifeLine} from "./life-line";
import {Message} from "./msg-info";
import {Author as AuthorJson} from "../sequence-diagram-models"
import {Preknowledge} from "./msg-info";
import {ParserContext} from "./parser/parser-context";
import {Ref} from "./parser/ref";

export class Author extends LifeLine{
  static readonly eClass = "http://www.unikoblenz.de/keml#//Author";
  static readonly preknowledgePrefix: string = 'preknowledge';
  preknowledge: Preknowledge[];
  static readonly messagesPrefix: string = 'messages';
  messages: Message[];

  constructor(name = 'Author', xPosition: number = 0, preknowledge: Preknowledge[] = [], messages: Message[] = [], authorJson?: AuthorJson,) {
    super(name, xPosition);
    this.preknowledge = preknowledge;
    this.messages = messages;

    this.ref = new Ref('', Author.eClass)
    this.listChildren.set(Author.preknowledgePrefix, this.preknowledge)
    this.listChildren.set(Author.messagesPrefix, this.messages)
  }

  static fromJson(author: AuthorJson, context: ParserContext): Author {

    let preknowledge = author.preknowledge.map(pre => Preknowledge.fromJSON(pre))
    context.putList('todo', this.preknowledgePrefix, preknowledge);
    console.log(context)
    let msgs = author.messages.map(message => Message.fromJSON(message, context))

    return new Author(author.name, author.xPosition, preknowledge, msgs) //todo
  }

  toJson(): AuthorJson {
    return {
      eClass: Author.eClass,
      name: this.name,
      xPosition: this.xPosition,
      messages: this.messages.map(m => m.toJson()),
      preknowledge: this.preknowledge.map(p => p.toJson()),
    }
  }

}
