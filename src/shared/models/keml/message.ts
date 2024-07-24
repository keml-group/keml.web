import {ConversationPartner} from "../sequence-diagram-models";
import {IOHelper} from "./iohelper";
import {SendMessage} from "./send-message";
import {ReceiveMessage} from "./receive-message";

export abstract class Message {
  counterPart: ConversationPartner;
  timing: number;
  content: string;
  originalContent?: string;

  protected constructor(
    counterPart: ConversationPartner,
    timing: number,
    content: string,
    originalContent?: string,
  ) {
    this.counterPart = counterPart;
    this.timing = timing;
    this.content = content;
    this.originalContent = originalContent;
  }

  fromJSON(json: string, conversationPartners: ConversationPartner[]): Message {
    let res = JSON.parse(json, (key, value) => {
      if (key === "counterPart") {
        this.counterPart = conversationPartners[IOHelper.resolveConversationPartnerReference(value.$ref)];
      }
    } );
    if (IOHelper.isSend(res.$ref)) {
      res.__proto__ = SendMessage.prototype;
      //return Object.assign(new SendMessage, res);
    } else {
      res.__proto__ = ReceiveMessage.prototype;
    }
    return res;
  }

  toJSON(): any {
    const cpJson = sessionStorage.getItem("conversationPartners");
    const convP: string[] = JSON.parse(cpJson? cpJson: "[]");
    const res: any = this;
    const index = convP.findIndex(v => v == this.counterPart.name);
    res.counterPart = {
      eClass : "http://www.unikoblenz.de/keml#//ConversationPartner",
      $ref : IOHelper.createConversationPartnerRef(index)
    }
    return res;
  }
}
