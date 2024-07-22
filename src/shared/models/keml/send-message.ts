import { ConversationPartner } from "../sequence-diagram-models";
import {Message} from "./message";

export class SendMessage implements Message {
    eClass: string = "http://www.unikoblenz.de/keml#//SendMessage";
    content: string;
    originalContent?: string;
    timing: number;
    counterPart: ConversationPartner;

    constructor(
      counterPart: ConversationPartner,
      timing: number,
      content?: string,
      originalContent?: string,
    ) {
      this.counterPart = counterPart;
      this.timing = timing;
      this.content = content? content: "NewSend_"+timing;
      this.originalContent = originalContent;
    }
}
