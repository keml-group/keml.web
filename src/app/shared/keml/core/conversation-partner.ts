import {LifeLine} from "./life-line";
import {ConversationPartnerJson} from "@app/shared/keml/json/sequence-diagram-models"
import {Ref} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {RefHandler} from "emfular";

export class ConversationPartner extends LifeLine {

    constructor(name: string = 'NewPartner', xPosition?: number, ref?: Ref) {
      let refC = RefHandler.createRefIfMissing(EClasses.ConversationPartner, ref)
      super(refC, name, xPosition);
    }

    override toJson(): ConversationPartnerJson {
      return super.toJson();
    }

    static fromJson(json: ConversationPartnerJson, ref: Ref): ConversationPartner {
      return new ConversationPartner(json.name, json.xPosition, ref)
    }

}
