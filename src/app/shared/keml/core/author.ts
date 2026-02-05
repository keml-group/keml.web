import {LifeLine} from "./life-line";
import {Message} from "./msg-info";
import {Preknowledge} from "./msg-info";
import {eClass, Ref, RefHandler, ReTreeListContainer} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";

@eClass(EClasses.Author)
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
    super();
    this._preknowledge = new ReTreeListContainer<Preknowledge>(this, Author.$preknowledgeName, undefined, EClasses.Preknowledge)
    this._messages = new ReTreeListContainer<Message>(this, Author.$messagesName)
  }

  static create(ref?: Ref, name?: string, xPosition: number = 0): Author {
    const auth = new Author(ref)
    auth.name = name? name: ''
    auth.xPosition = xPosition
    return auth
  }

}
