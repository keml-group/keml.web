import {LifeLine} from "./life-line";
import {ConversationPartner as ConversationPartnerJson} from "../sequence-diagram-models"
import {ParserContext} from "./parser/parser-context";
import {Ref} from "./parser/ref";

export class ConversationPartner extends LifeLine {

    eClass = 'http://www.unikoblenz.de/keml#//ConversationPartner';

    constructor(name: string = 'NewPartner', xPosition: number = 0, cpJson?: ConversationPartnerJson,) {
      super(name, xPosition);
      this.ref = new Ref('', this.eClass)
    }

    static fromJSON(cp: ConversationPartnerJson, _: ParserContext): ConversationPartner {
      return new ConversationPartner(cp.name, cp.xPosition);
    }

    toJson(): ConversationPartnerJson {
      return {
        eClass: this.eClass,
        name: this.name,
        xPosition: this.xPosition,
      }
    }
}
