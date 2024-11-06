import { Injectable } from '@angular/core';
import {
  Conversation as ConversationJson,
} from "../models/sequence-diagram-models";
import {Information} from "../models/keml/msg-info";
import {Preknowledge} from "../models/keml/msg-info";
import {NewInformation} from "../models/keml/msg-info";
import {LayoutHelper} from "../layout-helper";
import {Conversation} from "../models/keml/conversation";
import {ConversationPartner} from "../models/keml/conversation-partner";
import {Message} from "../models/keml/msg-info";
import {ReceiveMessage} from "../models/keml/msg-info"

@Injectable({
  providedIn: 'root'
})
export class ModelIOService {

  constructor() { }

  loadKEML(json: string): Conversation {
    let conv =  <ConversationJson>JSON.parse(json);

    let conv2 = Conversation.fromJSON(conv);
    LayoutHelper.positionConversationPartners(conv2.conversationPartners)
    return conv2;

    /*
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
    */
  }

  newKEML(): Conversation {

    const conv = new Conversation();
    LayoutHelper.positionConversationPartners(conv.conversationPartners)

    return conv;

    /*const author: Author = {
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
    }*/
  }

  private timeMessages(messages: Message[]) {
    for (let i = 0; i < messages.length; i++) {
      messages[i].timing = i;
    }
  }

  addNewConversationPartner(cps: ConversationPartner[]) {
    const cp: ConversationPartner = {
      name: 'New Partner',
      xPosition: LayoutHelper.nextConversationPartnerPosition(cps[cps.length-1]?.xPosition), //todo
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
      LayoutHelper.positionConversationPartners(cps);
    }
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
      LayoutHelper.positionConversationPartners(cps);
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
    return Message.duplicateMessage(msg, msgs)
  }

  addNewMessage(counterPart: ConversationPartner, isSend: boolean, msgs: Message[]): Message {
    const content = isSend ? 'New send content' : 'New receive content';
    const newMsg: Message = Message.newMessage(isSend, counterPart, msgs.length, content)
    msgs.push(newMsg);
    return newMsg;
  }

  deleteInfo(info: Information, infos: Information[]) {
    const pos = infos.indexOf(info);
    if (pos > -1) {
      infos.splice(pos, 1);
    }
  }

  duplicateInfo(info: Information, infos: Information[]): Information {
    const newInfo: Information = {
      causes: info.causes,
      currentTrust: info.currentTrust,
      eClass: info.eClass,
      initialTrust: info.initialTrust,
      isInstruction: info.isInstruction,
      isUsedOn: info.isUsedOn,
      message: 'Copy of ' + info.message,
      repeatedBy: info.repeatedBy,
      targetedBy: info.targetedBy,
      x: info.x, //todo use layout helper?
      y: info.y //todo use layout helper?
    }
    infos.push(newInfo); //todo position right after current info?
    return newInfo;
  }

  findInfoList(info: Information, pre: Preknowledge[], msgs: Message[]): Information[] {
    let pos = pre.indexOf(info);
    if (pos > -1) {
      return pre;
    } else {
      const receives = this.filterReceives(msgs);
      for (let i = 0; i <= receives.length - 1; i++) {
        if (this.isInfoFromMessage(info, receives[i])) {
            return receives[i].generates;
        }
      }
    }
    return [];
  }

  filterReceives(msgs: Message[]): ReceiveMessage[] {
    return msgs.filter(msg => !msg.isSend())
      .map(msg => msg as ReceiveMessage)
  }

  private isInfoFromMessage(info: Information, msg: ReceiveMessage): boolean {
    console.log(msg.generates)
    return msg.generates.indexOf(<NewInformation>info)>-1;
  }

  addNewPreknowledge(pres: Preknowledge[]): Preknowledge {
    const preknowledge: Preknowledge = {
      causes: [],
      currentTrust: 0.5,
      eClass: "http://www.unikoblenz.de/keml#//PreKnowledge",
      initialTrust: 0.5,
      isInstruction: false,
      isUsedOn: [],
      message: "New preknowledge",
      repeatedBy: [],
      targetedBy: [],
      x: 0,
      y: 0
    };
    pres.push(preknowledge);
    return preknowledge;
  }

  addNewNewInfo(causeMsg: ReceiveMessage): NewInformation {
    const newInfo: NewInformation = {
      causes: [],
      currentTrust: 0.5,
      eClass: "http://www.unikoblenz.de/keml#//NewInformation",
      initialTrust: 0.5,
      isInstruction: false,
      isUsedOn: [],
      message: "New Information",
      repeatedBy: [],
      source: causeMsg,
      targetedBy: [],
      x: 0,
      y: 0
    }
    causeMsg.generates.push(newInfo);
    return newInfo;
  }

  getFirstReceive(msgs: Message[]): ReceiveMessage | null {
    const receives = this.filterReceives(msgs);
    if (receives.length > 0) {
      return receives[0];
    } else {
      return null;
    }
  }

}
