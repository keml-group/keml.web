import {LifeLine} from "./life-line";
import {Message} from "./msg-info";
import {Author as AuthorJson} from "../sequence-diagram-models"
import {Preknowledge} from "./msg-info";
import {ParserContext} from "./parser/parser-context";
import {Ref} from "./parser/ref";
import {Referencable} from "./parser/referenceable";

export class Author extends LifeLine{
  // todo necessary? eClass = "http://www.unikoblenz.de/keml#//Author",
  preknowledge: Preknowledge[];
  messages: Message[];

  constructor(name = 'Author', xPosition: number = 0, preknowledge: Preknowledge[] = [], messages: Message[] = []) {
    super(name, xPosition);
    this.preknowledge = preknowledge;
    this.messages = messages;
  }

  static fromJson(author: AuthorJson, context: ParserContext): Author {

    let preknowledge = author.preknowledge.map(pre => Preknowledge.fromJSON(pre))
    context.putList('todo', 'preknowledge', preknowledge);
    console.log(context)
    let msgs = author.messages.map(message => Message.fromJSON(message, context))

    return new Author(author.name, author.xPosition, preknowledge, msgs) //todo
  }

  prepare(ownPos: string) {
    this.ref = new Ref(ownPos) //todo no eclass
    const prefixPre = Ref.computePrefix(ownPos, 'preknowledge')
    Referencable.prepareList(prefixPre, this.preknowledge)
  }

  toJson(): AuthorJson {
    return {
      name: this.name,
      xPosition: this.xPosition,
      messages: this.messages.map(m => m.toJson()),
      preknowledge: this.preknowledge.map(p => p.toJson()),
    }
  }

}
