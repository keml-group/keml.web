import {LifeLine} from "./life-line";

export class ConversationPartner extends LifeLine {

    constructor(name: string = 'NewPartner') {
      super(name);
    }
}
