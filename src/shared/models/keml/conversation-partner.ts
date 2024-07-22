import {LifeLine} from "./life-line";

export class ConversationPartner implements LifeLine {
    name: string;

    constructor(name: string = 'NewPartner') {
      this.name = name;
    }
}
