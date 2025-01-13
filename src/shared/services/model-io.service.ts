import {Injectable} from '@angular/core';
import {ConversationJson} from "../models/keml/json/sequence-diagram-models";
import {
  Information,
  InformationLink,
  Message,
  NewInformation,
  Preknowledge,
  ReceiveMessage, SendMessage,
} from "../models/keml/msg-info";
import {Conversation} from "../models/keml/conversation";
import {ConversationPartner} from "../models/keml/conversation-partner";
import {JsonFixer} from "../models/keml/parser/json-fixer";
import {LayoutHelper} from "../utility/layout-helper";
import {InformationLinkType} from "../models/keml/json/knowledge-models";
import {Author} from "../models/keml/author";
import {SVGAccessService} from "./svg-access.service";
import {GeneralHelper} from "../utility/general-helper";
import {LLMMessage} from "../models/llm/llmmessage";

@Injectable({
  providedIn: 'root'
})
export class ModelIOService {

  conversation!: Conversation;

  constructor(
    private svgAccessService: SVGAccessService,
  ) {
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

  convFromLlmMessages(llmMsgs: LLMMessage[]): Conversation {
    let cp = new ConversationPartner('LLM')
    const conv = new Conversation('From model', new Author(), [cp]);
    LayoutHelper.positionConversationPartners(conv.conversationPartners)
    for( let i=0; i < llmMsgs.length; i++) {
      let msg = this.createMsg(llmMsgs[i], cp, i)
      conv.author.messages.push(msg)
    }
    this.conversation = conv;
    return conv;
  }

  private createMsg(llmMsg: LLMMessage,counterPart: ConversationPartner, index: number): Message {
    return Message.newMessage(ModelIOService.isSend(llmMsg), counterPart, index, llmMsg.message, llmMsg.message)
  }

  private static isSend(llmMsg: LLMMessage): boolean {
    return llmMsg.author != 'LLM'
  }

  saveKEML(conv: Conversation): string {
    let convJson = conv.toJson()
    return JSON.stringify(convJson);
  }

  getAuthor(): Author {
    return this.conversation.author;
  }

  //************ Conversation Partners *****************

  getConversationPartners(): ConversationPartner[] {
    return this.conversation.conversationPartners;
  }

  addNewConversationPartner(): ConversationPartner {
    const cps = this.conversation.conversationPartners;
    const cp: ConversationPartner = new ConversationPartner(
      'New Partner',
      LayoutHelper.nextConversationPartnerPosition(cps[cps.length-1]?.xPosition), //todo
    );
    cps.push(cp);
    return cp;
  }

  disableMoveConversationPartnerRight(cp: ConversationPartner): boolean {
    const cps = this.conversation.conversationPartners;
    const pos = cps.indexOf(cp);
    return pos == -1 || pos+1 >= cps.length;
  }

  moveConversationPartnerRight(cp: ConversationPartner) {
    const cps = this.conversation.conversationPartners;
    const pos = cps.indexOf(cp);
    if (!this.disableMoveConversationPartnerRight(cp)) {
      cps[pos] = cps[pos+1];
      cps[pos + 1] = cp;
      LayoutHelper.positionConversationPartners(cps);
    }
  }

  disableMoveConversationPartnerLeft(cp: ConversationPartner): boolean {
    const pos = this.conversation.conversationPartners.indexOf(cp);
    return pos <= 0;
  }

  moveConversationPartnerLeft(cp: ConversationPartner) {
    const cps = this.conversation.conversationPartners;
    const pos = cps.indexOf(cp);
    if (!this.disableMoveConversationPartnerLeft(cp)) {
      cps[pos] = cps[pos-1];
      cps[pos-1] = cp;
      LayoutHelper.positionConversationPartners(cps);
    }
  }

  deleteConversationPartner(cp: ConversationPartner) {
    cp.destruct()
    this.deleteMsgsWithCP(cp)
    GeneralHelper.removeFromList(cp, this.conversation.conversationPartners)
  }

  deleteMsgsWithCP(cp: ConversationPartner) {
    this.conversation.author.messages.filter(m => m.counterPart == cp).forEach(m => {
      this.deleteMessage(m)
    })
  }

  duplicateConversationPartner(cp: ConversationPartner): ConversationPartner {
    const cps = this.conversation.conversationPartners;
    const pos = cps.indexOf(cp);
    const newCp: ConversationPartner = new ConversationPartner(
      'Duplicate of '+ cp.name,
      0 //todo how would we later compute a good position?
    )
    cps.splice(pos+1, 0, newCp);
    LayoutHelper.positionConversationPartners(cps); // complete re-positioning
    return newCp;
  }

  //************* Messages ********************

  moveMessageUp(msg: Message) {
    const msgs = this.conversation.author.messages
    //actually, timing should be equal to the index - can we rely on it?
    msgs[msg.timing] = msgs[msg.timing-1];
    msgs[msg.timing].timing++;
    this.svgAccessService.notifyPositionChangeMessage( msgs[msg.timing] )
    msgs[msg.timing-1] = msg;
    msg.timing--;
    this.svgAccessService.notifyPositionChangeMessage( msg)
  }

  disableMoveUp(msg: Message): boolean {
    return msg.timing<=0;
  }

  moveMessageDown(msg: Message) {
    const msgs = this.conversation.author.messages
    //actually, timing should be equal to the index - can we rely on it?
    msgs[msg.timing] = msgs[msg.timing+1];
    msgs[msg.timing].timing-=1;
    this.svgAccessService.notifyPositionChangeMessage(msgs[msg.timing])
    msgs[msg.timing+1] = msg;
    msg.timing+=1;
    this.svgAccessService.notifyPositionChangeMessage(msg)
  }

  disableMoveDown(msg: Message): boolean {
    return msg.timing>=this.conversation.author.messages.length-1;
  }

  deleteMessage(msg: Message) {
    const msgs = this.conversation.author.messages
    msg.destruct()
    GeneralHelper.removeFromList(msg, msgs)
    // adapt later messages:
      //todo also adapt infos
    for(let i = msg.timing; i < msgs.length; i++) {
      msgs[i].timing--;
      this.svgAccessService.notifyPositionChangeMessage(msgs[i])
    }
  }

  duplicateMessage(msg: Message): Message | undefined {
    if (this.msgPosFitsTiming(msg)) {
      let duplicate = Message.newMessage(msg.isSend(), msg.counterPart, msg.timing+1, 'Duplicate of '+ msg.content, msg.originalContent);
      this.insertMsgInPos(duplicate)
      return duplicate
    }
    return undefined
  }

  private insertMsgInPos(msg: Message) {
    const msgs = this.conversation.author.messages
    msgs.splice(msg.timing, 0, msg);
    // adapt later messages:
    //todo also adapt infos
    for(let i = msg.timing +1; i < msgs.length; i++) {
      msgs[i].timing++;
      this.svgAccessService.notifyPositionChangeMessage(msgs[i])
    }
  }

  addNewMessage(isSend: boolean, counterPart?: ConversationPartner): Message | undefined {
    if (this.conversation.conversationPartners.length > 0) {
      const cp = counterPart ? counterPart : this.conversation.conversationPartners[0];
      const content = isSend ? 'New send content' : 'New receive content';
      const msgs = this.conversation.author.messages
      const newMsg: Message = Message.newMessage(isSend, cp, msgs.length, content)
      msgs.push(newMsg);
      return newMsg;
    } else {
      console.error('No conversation partners found');
      return undefined;
    }
  }

  disableAddNewMessage(): boolean {
    return this.conversation.conversationPartners.length <= 0;
  }

  getReceives() {
    return this.conversation.author.messages.filter(msg => !msg.isSend())
      .map(msg => msg as ReceiveMessage)
  }

  getFirstReceive(): ReceiveMessage | undefined {
    const msgs = this.conversation.author.messages;
    return (msgs.find(m => !m.isSend()) as ReceiveMessage)
  }

  getSends(): SendMessage[] {
    return this.conversation.author.messages.filter(msg => msg.isSend())
      .map(msg => msg as SendMessage)
  }

  private msgPosFitsTiming(msg: Message): boolean {
    const msgs = this.conversation.author.messages
    if (msgs.indexOf(msg) != msg.timing) {
      console.error('Position and msg timing do not fit for ' + msg );
      return false;
    }
    return true;
  }

  addRepetition(rec: ReceiveMessage, info: Information) {
    //only add the repetition if it connects to an earlier info (either preknowledge or older new info
    const msgTime = rec.timing
    const infoTime = (info as NewInformation).source?.timing
    if (!infoTime || infoTime < msgTime ) {
      if(! rec.repeats.indexOf(info)) {
        rec.repeats.push(info)
        info.repeatedBy.push(rec)
      }
    } else {
      console.log('No repetition allowed')
    }
  }

  deleteRepetition(rec: ReceiveMessage, info: Information) {
    GeneralHelper.removeFromList(info, rec.repeats)
    GeneralHelper.removeFromList(rec, info.repeatedBy)
  }

  addUsage(send: SendMessage, info: Information) {
    const infoInd = send.uses.indexOf(info)
    if (infoInd > -1) {
      console.log('Usage already exists')
    } else {
      send.uses.push(info)
    }
    const msgInd = info.isUsedOn.indexOf(send)
    if (msgInd > -1) {
      console.log('Used on already exists')
    } else {
      info.isUsedOn.push(send)
    }
  }

  deleteUsage(send: SendMessage, info: Information) {
    GeneralHelper.removeFromList(info, send.uses)
    GeneralHelper.removeFromList(send, info.isUsedOn)
  }
  //************** Infos ************************

  deleteInfo(info: Information) {
    const infos = this.getRightInfoList(info)
    info.destruct()
    GeneralHelper.removeFromList(info, infos)
  }

  duplicateInfo(info: Information): Information {
    const infos = this.getRightInfoList(info)
    const newInfo = info.duplicate()
    infos.push(newInfo); //todo position right after current info?
    return newInfo;
  }

  private getRightInfoList(info: Information): Information[] {
    let maybeSource = (info as NewInformation).source
    if (maybeSource) {
      return maybeSource.generates;
    } else {
      return this.conversation.author.preknowledge
    }
  }

  addNewPreknowledge(): Preknowledge {
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
    this.conversation.author.preknowledge.push(preknowledge);
    return preknowledge;
  }

  disableAddNewNewInfo(): boolean {
    const rec = this.getFirstReceive();
    return !rec;
  }

  addNewNewInfo(causeMsg?: ReceiveMessage): NewInformation | undefined {
    let source = causeMsg? causeMsg : this.getFirstReceive()
    if (source) {
      const newInfo: NewInformation = new NewInformation(
        source,
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
      source.generates.push(newInfo);
      return newInfo;
    } else {
      console.error('No receive messages found');
      return undefined;
    }
  }

  //***************** information links ********************

  disableLinkCreation() {
    let size = this.conversation.author.preknowledge.length;
    if (size >=2)
      return false;
    else {
      for (let msg of this.conversation.author.messages) {
        let news = (msg as ReceiveMessage).generates
        if (news) {
          size += news.length
          if (size >=2)
            return false;
        }
      }
    }
    return true;
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
    link.destruct()
  }

  duplicateLink(link: InformationLink) {
    const newLink = new InformationLink(link.source, link.target, link.type, link.linkText)
    link.source.causes.splice(link.source.causes.indexOf(link),0, newLink);
    link.target.targetedBy.splice(link.target.targetedBy.indexOf(link), 0, newLink);
  }

}
