import {LifeLine} from "./life-line";
import {ConversationPartner as ConversationPartnerJson} from "../sequence-diagram-models"
import {ParserContext} from "./parser/parser-context";

export class ConversationPartner extends LifeLine {

    constructor(name: string = 'NewPartner', xPosition: number = 0) {
      super(name, xPosition);
    }

    static fromJSON(cp: ConversationPartnerJson, _: ParserContext): ConversationPartner {
      return new ConversationPartner(cp.name, cp.xPosition);
    }
}
