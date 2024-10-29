import {LifeLine} from "./life-line";
import {ConversationPartner as ConversationPartnerJson} from "../sequence-diagram-models"

export class ConversationPartner extends LifeLine {

    constructor(name: string = 'NewPartner', xPosition: number = 0) {
      super(name, xPosition);
    }

    static fromJSON(cp: ConversationPartnerJson): ConversationPartner {
      return new ConversationPartner(cp.name, cp.xPosition);
    }
}
