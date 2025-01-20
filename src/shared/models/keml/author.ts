import {LifeLine} from "./life-line";
import {Message} from "./msg-info";
import {AuthorJson} from "./json/sequence-diagram-models"
import {Preknowledge} from "./msg-info";
import {ParserContext} from "../parser/parser-context";
import {Ref} from "../parser/ref";

export class Author extends LifeLine{
  static readonly eClass = "http://www.unikoblenz.de/keml#//Author";
  static readonly preknowledgePrefix: string = 'preknowledge';
  preknowledge: Preknowledge[];
  static readonly messagesPrefix: string = 'messages';
  messages: Message[];

  constructor(name = 'Author', xPosition: number = 0, preknowledge: Preknowledge[] = [], messages: Message[] = [],
              ref?: Ref, parserContext?: ParserContext) {
    if (parserContext) {
      let authorJson: AuthorJson = parserContext?.getJsonFromTree(ref!.$ref)
      super(authorJson.name, authorJson.xPosition)
      this.ref = ref!
      parserContext.put(this)
      //compute and use refs for all tree children:
      let preknowledgeRefs = ParserContext.createRefList(ref!.$ref, Author.preknowledgePrefix, authorJson.preknowledge.map(_ => Preknowledge.eClass))
      this.preknowledge = preknowledgeRefs.map(r => parserContext.getOrCreate<Preknowledge>(r));
      let messageRefs = ParserContext.createRefList(ref!.$ref, Author.messagesPrefix, authorJson.messages.map(r => r.eClass))
      this.messages = messageRefs.map(r => parserContext.getOrCreate<Message>(r));
    } else {
      super(name, xPosition);
      this.preknowledge = preknowledge;
      this.messages = messages;
      //this.ref = new Ref('', Author.eClass)
    }
    this.listChildren.set(Author.preknowledgePrefix, this.preknowledge)
    this.listChildren.set(Author.messagesPrefix, this.messages)
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
