import {LifeLine} from "./life-line";
import {ConversationPartnerJson} from "@app/shared/keml/models/json/sequence-diagram-models"
import {Parser} from "@app/shared/keml/parser/parser";
import {Ref} from "@app/shared/keml/models/refs/ref";

export class ConversationPartner extends LifeLine {

    static readonly eClass = 'http://www.unikoblenz.de/keml#//ConversationPartner';

    constructor(name: string = 'NewPartner', xPosition?: number, ref?: Ref, parser?: Parser) {
      let refC = Ref.createRef(ConversationPartner.eClass, ref)
      if(parser) {
        let cpJson: ConversationPartnerJson = parser.getJsonFromTree(ref!.$ref)
        super(cpJson.name, cpJson.xPosition, refC)
        parser.put(this)
      } else {
        super(name, xPosition, refC);
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
