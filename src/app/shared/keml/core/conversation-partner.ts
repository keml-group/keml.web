import {LifeLine} from "./life-line";
import {eClass} from "emfular";
import {KemlMeta} from "@app/shared/keml/keml-meta";

@eClass(KemlMeta, "ConversationPartner")
export class ConversationPartner extends LifeLine {

  constructor(name: string = 'NewPartner', xPosition?: number) {
    super(name, xPosition);
  }

  static create(name: string = 'NewPartner', xPosition?: number): ConversationPartner {
    const cp = new ConversationPartner()
    cp.name = name
    cp.xPosition = xPosition? xPosition : 0;
    return cp;
  }

}
