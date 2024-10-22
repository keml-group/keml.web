import { Injectable } from '@angular/core';
import {Author, Conversation, ConversationPartner, Message, ReceiveMessage} from "../models/sequence-diagram-models";
import {NewInformation, Preknowledge} from "../models/knowledge-models";
import {LayoutHelper} from "../layout-helper";

@Injectable({
  providedIn: 'root'
})
export class ModelIOService {

  constructor() { }

  loadKEML(json: string): Conversation {
    let conv =  <Conversation>JSON.parse(json);

    //resolve conv Partner refs
    let convPartners = conv.conversationPartners;
    conv.author.messages?.forEach(message => {
      let ref = message.counterPart.$ref; //todo is correct because references are not correctly parsed now
      message.counterPart = convPartners[this.resolveConversationPartnerReference(ref? ref : "")];
    })
    // todo resolve others
    // cannot, throws bc of circular ref this.repairSourceOfNewInfo(conv.author.messages);

    // now, the automatic conversion of the convP is included:
    LayoutHelper.positionConversationPartners(conv.conversationPartners);
    this.timeMessages(conv.author.messages);
    LayoutHelper.positionInfos(conv.author.preknowledge, conv.author.messages);
    console.log(conv);
    return conv;
  }

  newKEML(): Conversation {
    const author: Author = {
      name: 'Author',
      xPosition: 0,
      messages: [],
      preknowledge: [],
    }
    const convP = [{name: 'LLM', xPosition: 1, messages: []}];
    LayoutHelper.positionConversationPartners(convP);
    return {
      eClass: 'http://www.unikoblenz.de/keml#//Conversation',
      title: 'New Conversation',
      author: author,
      conversationPartners: convP
    }
  }

  resolveConversationPartnerReference(ref: string): number {
    // form is //@conversationPartners.<digits> - so we just remove a prefix
    let length = "//@conversationPartners.".length;
    return parseInt(ref.substring(length))
  }

  private timeMessages(messages: Message[]) {
    for (let i = 0; i < messages.length; i++) {
      messages[i].timing = i;
    }
  }

  addNewConversationPartner(cps: ConversationPartner[]) {
    const cp: ConversationPartner = {
      name: 'New Partner',
      xPosition: LayoutHelper.nextConversationPartnerPosition(cps[cps.length-1].xPosition), //todo
    }
    cps.push(cp);
  }

  disableMoveConversationPartnerRight(cp: ConversationPartner, cps: ConversationPartner[]): boolean {
    const pos = cps.indexOf(cp);
    return pos == -1 || pos+1 >= cps.length;
  }

  moveConversationPartnerRight(cp: ConversationPartner, cps: ConversationPartner[]) {
    const pos = cps.indexOf(cp);
    if (!this.disableMoveConversationPartnerRight(cp, cps)) {
      cps[pos] = cps[pos+1];
      cps[pos + 1] = cp;
    }
    // todo
  }

  disableMoveConversationPartnerLeft(cp: ConversationPartner, cps: ConversationPartner[]): boolean {
    const pos = cps.indexOf(cp);
    return pos <= 0;
  }

  moveConversationPartnerLeft(cp: ConversationPartner, cps: ConversationPartner[]) {
    const pos = cps.indexOf(cp);
    if (!this.disableMoveConversationPartnerLeft(cp, cps)) {
      cps[pos] = cps[pos-1];
      cps[pos-1] = cp;
    }
  }

  deleteConversationPartner(cp: ConversationPartner, cps: ConversationPartner[]) {
    //todo allow if last?
    const pos = cps.indexOf(cp);
    cps.splice(pos, 1);
  }

  duplicateConversationPartner(cp: ConversationPartner, cps: ConversationPartner[]): ConversationPartner {
    const pos = cps.indexOf(cp);
    const newCp: ConversationPartner = {
      name: 'Duplicate of '+ cp.name,
      xPosition: 0, //todo how would we later compute a good position?
    }
    cps.splice(pos+1, 0, newCp);
    LayoutHelper.positionConversationPartners(cps); // complete re-positioning
    return newCp;
  }

  // todo do not use, it causes circles
  repairSourceOfNewInfo(messages: Message[]) {
    for (let msg of messages) {
      //const infos = (msg as ReceiveMessage).generates;
      (msg as ReceiveMessage)?.generates?.forEach(r => {
        r.source = <ReceiveMessage>msg;
      })
    }
  }

  private msgPosFitsTiming(msg: Message, msgs: Message[]): boolean {
    if (msgs.indexOf(msg) != msg.timing) {
      console.error('Position and msg timing do not fit for ' + msg );
      return false;
    }
    return true;
  }

  moveMessageUp(msg: Message, msgs: Message[]) {
    //actually, timing should be equal to the index - can we rely on it?
    msgs[msg.timing] = msgs[msg.timing-1];
    msgs[msg.timing].timing++;
    msgs[msg.timing-1] = msg;
    msg.timing--;
    // todo propagate change to infos
  }

  disableMoveUp(msg: Message): boolean {
    return msg.timing<=0;
  }

  moveMessageDown(msg: Message, msgs: Message[]) {
    //actually, timing should be equal to the index - can we rely on it?
    msgs[msg.timing] = msgs[msg.timing+1];
    msgs[msg.timing].timing-=1;
    msgs[msg.timing+1] = msg;
    msg.timing+=1;
    // todo propagate change to infos (move them?)
  }

  disableMoveDown(msg: Message, msgs: Message[]): boolean {
    return msg.timing>=msgs.length-1;
  }

  deleteMessage(msg: Message, msgs: Message[]) {
    if (this.msgPosFitsTiming(msg, msgs)) {
      msgs.splice(msg.timing, 1);
      // adapt later messages:
      //todo also adapt infos
      for(let i = msg.timing; i < msgs.length; i++) {
        msgs[i].timing--;
      }
    }
  }

  duplicateMessage(msg: Message, msgs: Message[]): Message | null {
    if (this.msgPosFitsTiming(msg, msgs)) {
      const newMsg: Message = {
        eClass: msg.eClass,
        counterPart: msg.counterPart,
        timing: msg.timing+1,
        content: 'Duplicate of ' + msg.content,
        originalContent: msg.originalContent,
      }
      msgs.splice(msg.timing +1, 0, newMsg);
      // adapt later messages:
      //todo also adapt infos
      for(let i = msg.timing +2; i < msgs.length; i++) {
        msgs[i].timing++;
      }
      return newMsg;
    }
    return null;
  }

  addNewMessage(counterPart: ConversationPartner, isSend: boolean, msgs: Message[]): Message {
    const eClass = isSend? 'http://www.unikoblenz.de/keml#//SendMessage' : 'http://www.unikoblenz.de/keml#//ReceiveMessage';
    const content = isSend ? 'New send content' : 'New receive content';
    const newMsg: Message = {
      eClass: eClass,
      counterPart: counterPart,
      timing: msgs.length,
      content: content,
      originalContent: 'Original content',
    }
    msgs.push(newMsg);
    return newMsg;
  }

}
