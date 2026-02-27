import {LifeLine} from "./life-line";
import {Message} from "./msg-info";
import {PreKnowledge} from "./msg-info";
import {eClass, reference, ModelList} from "emfular";
import {KemlMeta, AuthorRefs} from "@app/shared/keml/keml-meta";


@eClass(KemlMeta, "Author")
export class Author extends LifeLine {

  @reference(AuthorRefs.preknowledge)
  declare preknowledge: ModelList<PreKnowledge>;

  @reference(AuthorRefs.messages)
  declare messages: ModelList<Message>;

  constructor() {
    super();
  }

  addPreknowledge(...items: PreKnowledge[]) {
    items.map(i => this.preknowledge.push(i));
  }

  addMessage(...items: Message[]) {
    items.map(i => this.messages.push(i));
  }

  static create(name?: string, xPosition: number = 0): Author {
    const auth = new Author();
    auth.name = name ?? "";
    auth.xPosition = xPosition;
    return auth;
  }
}
