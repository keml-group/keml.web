import {LifeLine} from "./life-line";
import {Ref, RefHandler, eClass} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";

@eClass(EClasses.ConversationPartner)
export class ConversationPartner extends LifeLine {

  constructor(ref?: Ref, name: string = 'NewPartner', xPosition?: number) {
    let refC = RefHandler.createRefIfMissing(EClasses.ConversationPartner, ref)
    super(refC, name, xPosition);
  }

  static create(name: string = 'NewPartner', xPosition?: number, ref?: Ref): ConversationPartner {
    const cp = new ConversationPartner(ref)
    cp.name = name
    cp.xPosition = xPosition? xPosition : 0;
    return cp;
  }

}
