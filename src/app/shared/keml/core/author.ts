import {LifeLine} from "./life-line";
import {Message} from "./msg-info";
import {AuthorJson} from "@app/shared/keml/json/sequence-diagram-models"
import {Preknowledge} from "./msg-info";
import {Deserializer, Ref} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {RefHandler, ReTreeListContainer} from "emfular";

export class Author extends LifeLine{
  static readonly preknowledgePrefix: string = 'preknowledge';
  static readonly messagesPrefix: string = 'messages';

  _preknowledge: ReTreeListContainer<Preknowledge>;
  get preknowledge(): Preknowledge[] {
    return this._preknowledge.get()
  }
  addPreknowledge(...preknowledge: Preknowledge[]) {
    preknowledge.map(p => {
      this._preknowledge.add(p)
    })
  }

  _messages: ReTreeListContainer<Message>;
  get messages(): Message[] {
    return this._messages.get()
  }
  addMessage(...msgs: Message[]) {
    msgs.map(m => {
      this._messages.add(m)
    })
  }

  constructor(name = 'Author', xPosition: number = 0,
              ref?: Ref) {
    let refC = RefHandler.createRefIfMissing(EClasses.Author, ref)
    super(name, xPosition, refC);
    this._preknowledge = new ReTreeListContainer<Preknowledge>(this, Author.preknowledgePrefix)
    this._messages = new ReTreeListContainer<Message>(this, Author.messagesPrefix)
  }

  override toJson(): AuthorJson {
    let json: AuthorJson = (<AuthorJson>super.toJson())
    json.preknowledge = this._preknowledge.toJson()
    json.messages = this._messages.toJson()
    return json
  }

  static createTreeBackbone(ref: Ref, context: Deserializer): Author {
    let authorJson: AuthorJson = context.getJsonFromTree(ref.$ref)
    let author = new Author(authorJson.name? authorJson.name : '', authorJson.xPosition, ref)
    context.put(author)
    authorJson.messages.map((mj, i) => {
      let newRefRef = RefHandler.mixWithPrefixAndIndex(ref.$ref, Author.messagesPrefix, i)
      let newRef = RefHandler.createRef(newRefRef, mj.eClass)
      let m = Message.createTreeBackbone(newRef, context)
      author.addMessage(m)
    } )
    authorJson.preknowledge.map((_, i) => {
      let newRefRef = RefHandler.mixWithPrefixAndIndex(ref.$ref, Author.preknowledgePrefix, i)
      let newRef = RefHandler.createRef(newRefRef, EClasses.Preknowledge)
      let p = Preknowledge.createTreeBackbone(newRef, context)
      author.addPreknowledge(p)
    })
    return author
  }

}
