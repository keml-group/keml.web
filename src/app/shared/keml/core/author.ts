import {LifeLine} from "./life-line";
import {Message} from "./msg-info";
import {AuthorJson} from "@app/shared/keml/json/sequence-diagram-models"
import {Preknowledge} from "./msg-info";
import {Ref} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {RefHandler, ReTreeListContainer} from "emfular";

export class Author extends LifeLine{
  static readonly $preknowledgeName: string = 'preknowledge';
  static readonly $messagesName: string = 'messages';

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

  constructor(ref?: Ref) {
    let refC = RefHandler.createRefIfMissing(EClasses.Author, ref)
    super(refC);
    this._preknowledge = new ReTreeListContainer<Preknowledge>(this, Author.$preknowledgeName, undefined, EClasses.Preknowledge)
    this._messages = new ReTreeListContainer<Message>(this, Author.$messagesName)
  }

  static create(ref?: Ref, name?: string, xPosition: number = 0): Author {
    const auth = new Author(ref)
    auth.name = name? name: ''
    auth.xPosition = xPosition
    return auth
  }

  static fromJson(json: AuthorJson, ref: Ref): Author {
    return Author.create(ref, json.name ? json.name : '', json.xPosition)
  }

  override toJson(): AuthorJson {
    let json: AuthorJson = (<AuthorJson>super.toJson())
    json.preknowledge = this._preknowledge.toJson()
    json.messages = this._messages.toJson()
    return json
  }

}
