import {LifeLine} from "./life-line";
import {Message} from "./msg-info";
import {AuthorJson} from "@app/shared/keml/json/sequence-diagram-models"
import {Preknowledge} from "./msg-info";
import {Deserializer, Ref} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {RefHandler, ReferencableTreeListContainer} from "emfular";

export class Author extends LifeLine{
  static readonly preknowledgePrefix: string = 'preknowledge';
  static readonly messagesPrefix: string = 'messages';

  _preknowledge: ReferencableTreeListContainer<Preknowledge>;
  get preknowledge(): Preknowledge[] {
    return this._preknowledge.get()
  }
  addPreknowledge(...preknowledge: Preknowledge[]) {
    preknowledge.map(p => {
      this._preknowledge.add(p)
    })
  }

  _messages: ReferencableTreeListContainer<Message>;
  get messages(): Message[] {
    return this._messages.get()
  }
  addMessage(...msgs: Message[]) {
    msgs.map(m => {
      this._messages.add(m)
    })
  }

  constructor(name = 'Author', xPosition: number = 0,
              ref?: Ref, deserializer?: Deserializer) {
    let refC = RefHandler.createRefIfMissing(EClasses.Author, ref)
    if (deserializer) {
      let authorJson: AuthorJson = deserializer.getJsonFromTree(ref!.$ref)
      super(authorJson.name, authorJson.xPosition, refC)
      this._preknowledge = new ReferencableTreeListContainer<Preknowledge>(this, Author.preknowledgePrefix)
      this._messages = new ReferencableTreeListContainer<Message>(this, Author.messagesPrefix)
      deserializer.put(this)
      //compute and use refs for all tree children:
      let preknowledgeRefs = Deserializer.createRefList(ref!.$ref, Author.preknowledgePrefix, authorJson.preknowledge? authorJson.preknowledge.map(_ => EClasses.Preknowledge): [])
      preknowledgeRefs.map(r => this.addPreknowledge(deserializer.getOrCreate<Preknowledge>(r)));
      let messageRefs = Deserializer.createRefList(ref!.$ref, Author.messagesPrefix, authorJson.messages.map(r => r.eClass))
      messageRefs.map(r => this.addMessage(deserializer.getOrCreate<Message>(r)));
    } else {
      super(name, xPosition, refC);
      this._preknowledge = new ReferencableTreeListContainer<Preknowledge>(this, Author.preknowledgePrefix)
      this._messages = new ReferencableTreeListContainer<Message>(this, Author.messagesPrefix)
    }

    this.listChildren.set(Author.preknowledgePrefix, this.preknowledge)
    this.listChildren.set(Author.messagesPrefix, this.messages)
  }

  toJson(): AuthorJson {
    return {
      name: this.name,
      xPosition: this.xPosition,
      messages: this.messages.map(m => m.toJson()),
      preknowledge: this.preknowledge.map(p => p.toJson()),
    }
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
