import {Message} from "./message";
import {ConversationPartner} from "./conversation-partner";
import {NewInformation} from "./new-information";

export class ReceiveMessage extends Message {
  override readonly eClass: string = "http://www.unikoblenz.de/keml#//ReceiveMessage";
  generates: NewInformation[];

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content?: string,
    originalContent?: string,
    generates: NewInformation[] = [],
  ) {
    super(
      counterPart,
      timing,
      content? content: "NewReceive_"+timing,
      originalContent
    );
    this.generates = generates;
  }

}
