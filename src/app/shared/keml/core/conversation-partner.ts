import {LifeLine} from "./life-line";
import {ConversationPartnerJson} from "@app/shared/keml/json/sequence-diagram-models"
import {Deserializer, Ref} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {RefHandler} from "emfular";

export class ConversationPartner extends LifeLine {

    constructor(name: string = 'NewPartner', xPosition?: number, ref?: Ref, deserializer?: Deserializer) {
      let refC = RefHandler.createRefIfMissing(EClasses.ConversationPartner, ref)
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
        name: this.name,
        xPosition: this.xPosition,
      }
    }

    static createTreeBackbone(cpJson: ConversationPartnerJson, ref: Ref, context: Deserializer): ConversationPartner {
        let cp = new ConversationPartner(cpJson.name, cpJson.xPosition, ref)
        context.put(cp)
        return cp;
    }
}
