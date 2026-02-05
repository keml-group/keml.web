import {LifeLine} from "./life-line";
import {eClass} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";

@eClass(EClasses.ConversationPartner)
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
