import {LifeLine} from "./life-line";
import {Message} from "./msg-info";
import {Preknowledge} from "./msg-info";
import {eClass, ReTreeListContainer} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";

@eClass(EClasses.Author)
export class Author extends LifeLine{
  static readonly $preknowledgeName = 'preknowledge';
  static readonly $messagesName = 'messages';

  _preknowledge: ReTreeListContainer<Preknowledge, typeof Author.$preknowledgeName>;
  get preknowledge(): Preknowledge[] {
    return this._preknowledge.get()
  }
  addPreknowledge(...preknowledge: Preknowledge[]) {
    preknowledge.map(p => {
      this._preknowledge.add(p)
    })
  }

  _messages: ReTreeListContainer<Message, typeof Author.$messagesName>;
  get messages(): Message[] {
    return this._messages.get()
  }
  addMessage(...msgs: Message[]) {
    msgs.map(m => {
      this._messages.add(m)
    })
  }

  constructor() {
    super();
    this._preknowledge = new ReTreeListContainer(this, Author.$preknowledgeName, undefined, EClasses.Preknowledge)
    this._messages = new ReTreeListContainer(this, Author.$messagesName)
  }

  static create(name?: string, xPosition: number = 0): Author {
    const auth = new Author()
    auth.name = name? name: ''
    auth.xPosition = xPosition
    return auth
  }

}
