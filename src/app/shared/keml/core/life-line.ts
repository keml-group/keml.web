import {Referencable, attribute} from "emfular";
import {Conversation} from "@app/shared/keml/core/conversation";

export abstract class LifeLine extends Referencable<Conversation>{
  @attribute()
  name: string;
  @attribute()
  xPosition: number; //int todo

  protected constructor(name?: string, xPosition: number = 0) {
    super();
    this.name = name? name: '';
    this.xPosition = xPosition;
  }

}
