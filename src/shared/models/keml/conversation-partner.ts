import {LifeLine} from "./life-line";
import {ConversationPartnerJson} from "../json/sequence-diagram-models"
import {ParserContext} from "./parser/parser-context";
import {Ref} from "./parser/ref";

export class ConversationPartner extends LifeLine {

    static readonly eClass = 'http://www.unikoblenz.de/keml#//ConversationPartner';

    constructor(name: string = 'NewPartner', xPosition?: number, ref?: Ref, parserContext?: ParserContext) {
      if(parserContext) {
        let cpJson: ConversationPartnerJson = parserContext.getJsonFromTree(ref!.$ref)
        super(cpJson.name, cpJson.xPosition)
        this.ref = ref!
        parserContext.put(this)
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
