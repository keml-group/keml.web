import {Injectable} from '@angular/core';
import {ConversationJson} from "../models/keml/json/sequence-diagram-models";
import {
  Information,
  InformationLink,
  Message,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
} from "../models/keml/msg-info";
import {Conversation} from "../models/keml/conversation";
import {ConversationPartner} from "../models/keml/conversation-partner";
import {JsonFixer} from "../models/keml/parser/json-fixer";
import {LayoutHelper} from "../utility/layout-helper";
import {InformationLinkType} from "../models/keml/json/knowledge-models";

@Injectable({
  providedIn: 'root'
})
export class ModelIOService {

  conversation!: Conversation;

  constructor() {
    console.log("ModelIOService constructed");
    this.newKEML();
  }

  loadKEML(json: string): Conversation {
    let convJson =  <ConversationJson>JSON.parse(json);
    JsonFixer.prepareJsonInfoLinkSources(convJson);
    JsonFixer.addMissingSupplementType(convJson);

    let conv = Conversation.fromJSON(convJson);
    LayoutHelper.positionConversationPartners(conv.conversationPartners)
    LayoutHelper.positionInfos(conv.author.preknowledge, conv.author.messages);

    this.conversation = conv;
    console.log(this.conversation)
    return conv;
  }

  newKEML(): Conversation {
    const conv = new Conversation();
    LayoutHelper.positionConversationPartners(conv.conversationPartners)
    this.conversation = conv;
    return conv;
  }

  saveKEML(conv: Conversation): string {
    let convJson = conv.toJson()
    return JSON.stringify(convJson);
  }

  addNewConversationPartner(cps: ConversationPartner[]) {
    const cp: ConversationPartner = new ConversationPartner(
      'New Partner',
      LayoutHelper.nextConversationPartnerPosition(cps[cps.length-1]?.xPosition), //todo
    );
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
    const newCp: ConversationPartner = new ConversationPartner(
      'Duplicate of '+ cp.name,
      0 //todo how would we later compute a good position?
    )
    cps.splice(pos+1, 0, newCp);
    LayoutHelper.positionConversationPartners(cps); // complete re-positioning
    return newCp;
  }

  private msgPosFitsTiming(msg: Message): boolean {
    const msgs = this.conversation.author.messages
    if (msgs.indexOf(msg) != msg.timing) {
      console.error('Position and msg timing do not fit for ' + msg );
      return false;
    }
    return true;
  }

  moveMessageUp(msg: Message) {
    const msgs = this.conversation.author.messages
    //actually, timing should be equal to the index - can we rely on it?
    msgs[msg.timing] = msgs[msg.timing-1];
    msgs[msg.timing].timing++;
    msgs[msg.timing-1] = msg;
    msg.timing--;
  }

  disableMoveUp(msg: Message): boolean {
    return msg.timing<=0;
  }

  moveMessageDown(msg: Message) {
    const msgs = this.conversation.author.messages
    //actually, timing should be equal to the index - can we rely on it?
    msgs[msg.timing] = msgs[msg.timing+1];
    msgs[msg.timing].timing-=1;
    msgs[msg.timing+1] = msg;
    msg.timing+=1;
  }

  disableMoveDown(msg: Message): boolean {
    return msg.timing>=this.conversation.author.messages.length-1;
  }

  deleteMessage(msg: Message) {
    const msgs = this.conversation.author.messages
    if (this.msgPosFitsTiming(msg)) {
      msgs.splice(msg.timing, 1);
      // adapt later messages:
      //todo also adapt infos
      for(let i = msg.timing; i < msgs.length; i++) {
        msgs[i].timing--;
      }
    }
  }

  duplicateMessage(msg: Message): Message | null {
    const msgs = this.conversation.author.messages
    return Message.duplicateMessage(msg, msgs)
  }

  addNewMessage(counterPart: ConversationPartner, isSend: boolean): Message {
    const msgs = this.conversation.author.messages
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
    const newInfo = info.duplicate()
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

  getReceives() {
    return this.filterReceives(this.conversation.author.messages);
  }

  private isInfoFromMessage(info: Information, msg: ReceiveMessage): boolean {
    return msg.generates.indexOf(<NewInformation>info)>-1;
  }

  addNewPreknowledge(pres: Preknowledge[]): Preknowledge {
    const preknowledge: Preknowledge = new Preknowledge(
      "New preknowledge",
      false,
      LayoutHelper.bbForPreknowledge(0),
      0.5,
      0.5,
      0.5,
      0.5,
      [],
      [],
      [],
      [],
    );
    pres.push(preknowledge);
    return preknowledge;
  }

  addNewNewInfo(causeMsg: ReceiveMessage): NewInformation {
    const newInfo: NewInformation = new NewInformation(
      causeMsg,
      'New Information',
      false,
      LayoutHelper.bbForNewInfo(),
      0.5,
      0.5,
      0.5,
      0.5,
      [],
      [],
      [],
      [],
    );
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

  addInformationLink(src: Information, target: Information, type: InformationLinkType = InformationLinkType.SUPPLEMENT, text?: string): InformationLink {
    return new InformationLink(
      src,
      target,
      type,
      text
    );
  }

  deleteLink(link: InformationLink) {
    const srcIndex = link.source.causes.indexOf(link)
    if (srcIndex > -1) {
      link.source.causes.splice(srcIndex, 1);
    }
    const targetIndex = link.target.targetedBy.indexOf(link);
    if (targetIndex > -1) {
      link.target.targetedBy.splice(targetIndex, 1);
    }
  }

  duplicateLink(link: InformationLink) {
    const newLink = new InformationLink(link.source, link.target, link.type, link.linkText)
    link.source.causes.splice(link.source.causes.indexOf(link),0, newLink);
    link.target.targetedBy.splice(link.target.targetedBy.indexOf(link), 0, newLink);
  }

}
