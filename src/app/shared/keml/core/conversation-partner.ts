import {LifeLine} from "./life-line";
import {ConversationPartnerJson} from "@app/shared/keml/json/sequence-diagram-models"
import {Deserializer, Ref} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {RefHandler} from "emfular";

export class ConversationPartner extends LifeLine {

    constructor(name: string = 'NewPartner', xPosition?: number, ref?: Ref) {
      let refC = RefHandler.createRefIfMissing(EClasses.ConversationPartner, ref)
      super(name, xPosition, refC);
    }

    override toJson(): ConversationPartnerJson {
      return super.toJson();
    }

    static fromJson(json: ConversationPartnerJson): ConversationPartner {
      return new ConversationPartner(json.name, json.xPosition)
    }

}
