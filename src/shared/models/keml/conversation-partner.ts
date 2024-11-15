import {LifeLine} from "./life-line";
import {ConversationPartner as ConversationPartnerJson} from "../sequence-diagram-models"
import {ParserContext} from "./parser/parser-context";
import {Ref} from "./parser/ref";

export class ConversationPartner extends LifeLine {

    static readonly eClass = 'http://www.unikoblenz.de/keml#//ConversationPartner';

    constructor(name: string = 'NewPartner', xPosition?: number, cpJson?: ConversationPartnerJson, parserContext?: ParserContext) {
      if(parserContext) {
        super(cpJson!.name, cpJson?.xPosition)
        this.ref = new Ref('', ConversationPartner.eClass)
        parserContext.put(this)
        console.log(this)
      } else {
        super(name, xPosition);
        this.ref = new Ref('', ConversationPartner.eClass)
      }
    }

    toJson(): ConversationPartnerJson {
      return {
        eClass: ConversationPartner.eClass,
        name: this.name,
        xPosition: this.xPosition,
      }
    }
}
