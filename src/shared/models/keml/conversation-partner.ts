import {LifeLine} from "./life-line";
import {ConversationPartner as ConversationPartnerJson} from "../sequence-diagram-models"
import {ParserContext} from "./parser/parser-context";
import {Ref} from "./parser/ref";

export class ConversationPartner extends LifeLine {

    constructor(name: string = 'NewPartner', xPosition: number = 0) {
      super(name, xPosition);
    }

    static fromJSON(cp: ConversationPartnerJson, _: ParserContext): ConversationPartner {
      return new ConversationPartner(cp.name, cp.xPosition);
    }

    toJson(): ConversationPartnerJson {
      return {
        name: this.name,
        xPosition: this.xPosition,
      }
    }

    prepare(ownPos: string) {
      this.ref = new Ref(ownPos) // todo no eclass
    }
}
