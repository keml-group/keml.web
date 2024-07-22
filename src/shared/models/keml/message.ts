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

  toJSON(conversationPartners: ConversationPartner[]): string {
    return JSON.stringify(this, (key: string, value) => {
      if (key === "counterPart") {
        return {
          eClass : "http://www.unikoblenz.de/keml#//ConversationPartner",
          $ref : IOHelper.createConversationPartnerRef(IOHelper.findIndexOnArray(value, conversationPartners))
        };
      } else return value;
    });
  }
}
