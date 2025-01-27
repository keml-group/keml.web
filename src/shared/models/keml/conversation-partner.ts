import {LifeLine} from "./life-line";
import {ConversationPartnerJson} from "./json/sequence-diagram-models"
import {Parser} from "../parser/parser";
import {Ref} from "../parser/ref";

export class ConversationPartner extends LifeLine {

    static readonly eClass = 'http://www.unikoblenz.de/keml#//ConversationPartner';

    constructor(name: string = 'NewPartner', xPosition?: number, ref?: Ref, parser?: Parser) {
      let refC = Ref.createRef(ConversationPartner.eClass, ref)
      if(parser) {
        let cpJson: ConversationPartnerJson = parser.getJsonFromTree(ref!.$ref)
        super(cpJson.name, cpJson.xPosition, refC)
        this.ref = ref!
        parser.put(this)
      } else {
        super(name, xPosition, refC);
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
