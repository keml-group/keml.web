import {ConversationPartner} from "./conversation-partner";
import {IOHelper} from "./iohelper";
import {SendMessage} from "./send-message";
import {ReceiveMessage} from "./receive-message";

import {Message as MessageJson} from "../sequence-diagram-models";

export abstract class Message {
  eClass: string = '';
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

  static fromJSON(msg: MessageJson, conversationPartners: ConversationPartner[]): Message {
    let counterPart: ConversationPartner = conversationPartners[IOHelper.resolveConversationPartnerReference(msg.counterPart.$ref)];
    if(IOHelper.isSend(msg.eClass)) {
      return new SendMessage(counterPart, msg.timing, msg.content, msg.originalContent)
    } else {
      return new ReceiveMessage(counterPart, msg.timing, msg.content, msg.originalContent)
    }
  }

  private static msgPosFitsTiming(msg: Message, msgs: Message[]): boolean {
    if (msgs.indexOf(msg) != msg.timing) {
      console.error('Position and msg timing do not fit for ' + msg );
      return false;
    }
    return true;
  }

  static duplicateMessage(msg: Message, msgs: Message[]): Message | null {
    if (this.msgPosFitsTiming(msg, msgs)) {
      let duplicate;
      if(IOHelper.isSend(msg.eClass)) {
        duplicate = new SendMessage(msg.counterPart, msg.timing, msg.content, msg.originalContent)
      } else {
        duplicate = new ReceiveMessage(msg.counterPart, msg.timing, msg.content, msg.originalContent)
      }
      this.insertMsgInPos(duplicate, msgs)
      return duplicate;
    }
    return null
  }

  static insertMsgInPos(msg: Message, msgs: Message[]): void {
    msgs.splice(msg.timing, 0, msg);
    // adapt later messages:
    //todo also adapt infos
    for(let i = msg.timing +1; i < msgs.length; i++) {
      msgs[i].timing++;
    }
  }

}
