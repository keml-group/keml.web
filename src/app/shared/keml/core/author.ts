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

  constructor(name = 'Author', xPosition: number = 0,
              ref?: Ref) {
    let refC = RefHandler.createRefIfMissing(EClasses.Author, ref)
    super(name, xPosition, refC);
    this._preknowledge = new ReTreeListContainer<Preknowledge>(this, Author.$preknowledgeName, undefined, EClasses.Preknowledge)
    this._messages = new ReTreeListContainer<Message>(this, Author.$messagesName)
  }

  override toJson(): AuthorJson {
    let json: AuthorJson = (<AuthorJson>super.toJson())
    json.preknowledge = this._preknowledge.toJson()
    json.messages = this._messages.toJson()
    return json
  }

  static fromJson(json: AuthorJson): Author {
    return new Author(json.name? json.name: '', json.xPosition)
  }


}
