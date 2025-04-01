import {LifeLine} from "./life-line";
import {ConversationPartnerJson} from "@app/shared/keml/models/json/sequence-diagram-models"
import {Deserializer, Ref} from "emfular";

export class ConversationPartner extends LifeLine {

    static readonly eClass = 'http://www.unikoblenz.de/keml#//ConversationPartner';

    constructor(name: string = 'NewPartner', xPosition?: number, ref?: Ref, deserializer?: Deserializer) {
      let refC = Ref.createRef(ConversationPartner.eClass, ref)
      if(deserializer) {
        let cpJson: ConversationPartnerJson = deserializer.getJsonFromTree(ref!.$ref)
        super(cpJson.name, cpJson.xPosition, refC)
        deserializer.put(this)
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
