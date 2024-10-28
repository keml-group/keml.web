import {Message} from "./message";
import {ConversationPartner} from "./conversation-partner";

export class ReceiveMessage extends Message {
  static eClass: string = "http://www.unikoblenz.de/keml#//ReceiveMessage";

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content?: string,
    originalContent?: string,
  ) {
    super(
      counterPart,
      timing,
      content? content: "NewReceive_"+timing,
      originalContent
    );
  }

}
