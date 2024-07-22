import { ConversationPartner } from "../sequence-diagram-models";
import {Message} from "./message";

export class SendMessage extends Message {
    static eClass: string = "http://www.unikoblenz.de/keml#//SendMessage";

    constructor(
      counterPart: ConversationPartner,
      timing: number,
      content?: string,
      originalContent?: string,
    ) {
      super(
        counterPart,
        timing,
        content? content: "NewSend_"+timing,
        originalContent
      );
    }

}
