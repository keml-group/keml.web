import {Injectable} from '@angular/core';
import {
  Information,
  InformationLink,
  Message,
  NewInformation,
  Preknowledge,
  ReceiveMessage, SendMessage,
} from "@app/shared/keml/core/msg-info";
import {Conversation} from "@app/shared/keml/core/conversation";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {LayoutingService} from "../graphical/layouting.service";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";
import {Author} from "@app/shared/keml/core/author";
import {ListUpdater} from "emfular";
import {MsgPositionChangeService} from "@app/shared/keml/graphical/msg-position-change.service";
import {AlertService} from "ngx-emfular-helper";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {JsonFixer} from "@app/shared/keml/json2core/json-fixer";

@Injectable({
  providedIn: 'root'
})
export class KemlService {

  public conversation!: Conversation;

  constructor(
    private msgPositionChangeService: MsgPositionChangeService,
    private alertService: AlertService,
    private layoutingService: LayoutingService,
  ) {
    this.conversation = new Conversation();
    this.layoutingService.positionConversationPartners(this.conversation.conversationPartners)
  }

  newConversation(title?: string) {
    this.conversation = new Conversation(title);
  }

  serializeConversation(): ConversationJson {
    return this.conversation.toJson()
  }

  deserializeConversation(convJson: ConversationJson): Conversation {
    JsonFixer.prepareJsonInfoLinkSources(convJson);
    JsonFixer.addMissingSupplementType(convJson);

    let conv = Conversation.fromJSON(convJson);
    this.layoutingService.positionConversationPartners(conv.conversationPartners)
    KemlService.timeMessages(conv.author.messages)
    LayoutingService.positionInfos(conv.author.preknowledge, conv.author.messages);
    this.conversation = conv;
    return conv;
  }

  static timeMessages(msgs: Message[]) {
    msgs.forEach((msg, i) => {
      msg.timing = i
    })
  }

  getTitle(): string {
    return this.conversation.title;
  }

  getAuthor(): Author {
    return this.conversation.author;
  }

  //************ Conversation Partners *****************

  getConversationPartners(): ConversationPartner[] {
    return this.conversation.conversationPartners;
  }

  addNewConversationPartner(name?: string): ConversationPartner {
    const cps = this.conversation.conversationPartners;
    const cp: ConversationPartner = new ConversationPartner(
      name? name : 'New Partner',
      this.layoutingService.nextConversationPartnerPosition(cps[cps.length-1]?.xPosition), //todo
    );
    cps.push(cp);
    return cp;
  }

  isMoveConversationPartnerRightDisabled(cp: ConversationPartner): boolean {
    const cps = this.conversation.conversationPartners;
    const pos = cps.indexOf(cp);
    return pos == -1 || pos+1 >= cps.length;
  }

  moveConversationPartnerRight(cp: ConversationPartner) {
    const cps = this.conversation.conversationPartners;
    const pos = cps.indexOf(cp);
    if (!this.isMoveConversationPartnerRightDisabled(cp)) {
      cps[pos] = cps[pos+1];
      cps[pos + 1] = cp;
      this.layoutingService.positionConversationPartners(cps);
    }
  }

  isMoveConversationPartnerLeftDisabled(cp: ConversationPartner): boolean {
    const pos = this.conversation.conversationPartners.indexOf(cp);
    return pos <= 0;
  }

  moveConversationPartnerLeft(cp: ConversationPartner) {
    const cps = this.conversation.conversationPartners;
    const pos = cps.indexOf(cp);
    if (!this.isMoveConversationPartnerLeftDisabled(cp)) {
      cps[pos] = cps[pos-1];
      cps[pos-1] = cp;
      this.layoutingService.positionConversationPartners(cps);
    }
  }

  deleteConversationPartner(cp: ConversationPartner) {
    cp.destruct()
    this.deleteMsgsWithCP(cp)
    ListUpdater.removeFromList(cp, this.conversation.conversationPartners)
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
    this.layoutingService.positionConversationPartners(cps); // complete re-positioning
    return newCp;
  }

  //************* Messages ********************

  moveMessageUp(msg: Message) {
    const msgs = this.conversation.author.messages
    //actually, timing should be equal to the index - can we rely on it?
    msgs[msg.timing] = msgs[msg.timing-1];
    msgs[msg.timing].timing++;
    this.msgPositionChangeService.notifyPositionChangeMessage( msgs[msg.timing] )
    msgs[msg.timing-1] = msg;
    msg.timing--;
    this.msgPositionChangeService.notifyPositionChangeMessage( msg)
  }

  isMoveUpDisabled(msg: Message): boolean {
    return msg.timing<=0;
  }

  moveMessageDown(msg: Message) {
    const msgs = this.conversation.author.messages
    //actually, timing should be equal to the index - can we rely on it?
    msgs[msg.timing] = msgs[msg.timing+1];
    msgs[msg.timing].timing-=1;
    this.msgPositionChangeService.notifyPositionChangeMessage(msgs[msg.timing])
    msgs[msg.timing+1] = msg;
    msg.timing+=1;
    this.msgPositionChangeService.notifyPositionChangeMessage(msg)
  }

  isMoveDownDisabled(msg: Message): boolean {
    return msg.timing>=this.conversation.author.messages.length-1;
  }

  deleteMessage(msg: Message) {
    const msgs = this.conversation.author.messages
    msg.destruct()
    ListUpdater.removeFromList(msg, msgs)
    // adapt later messages:
    this.moveMessagesUp(msg.timing, msgs.length)
  }

  duplicateMessage(msg: Message): Message | undefined {
    if (this.msgPosFitsTiming(msg)) {
      let duplicate = Message.newMessage(msg.isSend(), msg.counterPart, msg.timing+1, 'Duplicate of '+ msg.content, msg.originalContent);
      this.insertMsgInPos(duplicate)
      return duplicate
    }
    return undefined
  }

  changeMessagePos(msg: Message, newPos: number) {
    const affectedMsgs = newPos -msg.timing
    const msgs = this.conversation.author.messages
    if (newPos >= msgs.length) {
      let errormsg = 'Position should not be more than ' + msgs.length
      this.alertService.alert(errormsg)
      return;
    }
    if(affectedMsgs > 0) { // new pos is further down -> just move all msgs starting from msg timing+1 up until affectedMsgs reached
      this.moveMessagesUp(msg.timing+1, newPos + 1)
    } else {
      // if neutral: noop, can get handled in any way with 0 affected msgs
      // if negative: msg is further down, hence move all msgs starting from timing-1 one element down
      this.moveMessagesDown( newPos, msg.timing)
    }
    msgs.splice(msg.timing, 1)
    msg.timing = newPos
    msgs.splice(newPos, 0, msg)
    this.msgPositionChangeService.notifyPositionChangeMessage(msg)
  }

  private moveMessagesDown(start: number, afterEnd: number) {
    const msgs = this.conversation.author.messages
    for(let i = start; i < afterEnd; i++) {
      msgs[i].timing++;
      this.msgPositionChangeService.notifyPositionChangeMessage(msgs[i])
      //todo also adapt infos?
    }
  }

  private moveMessagesUp(start: number, afterEnd: number) {
    const msgs = this.conversation.author.messages
    for(let i = start; i < afterEnd; i++) {
      msgs[i].timing--;
      this.msgPositionChangeService.notifyPositionChangeMessage(msgs[i])
      //todo also adapt infos?
    }
  }

  private insertMsgInPos(msg: Message) {
    const msgs = this.conversation.author.messages
    msgs.splice(msg.timing, 0, msg);
    // adapt later messages:
    this.moveMessagesDown(msg.timing +1, msgs.length)
  }

  addNewMessage(isSend: boolean, counterPart?: ConversationPartner, content?: string, originalContent?: string): Message | undefined {
    if (this.conversation.conversationPartners.length > 0) {
      const cp = counterPart ? counterPart : this.conversation.conversationPartners[0];
      const defaultContent = isSend ? 'New send content' : 'New receive content';
      let cont = content ? content : defaultContent
      let originalCont = originalContent ? originalContent : defaultContent
      const msgs = this.conversation.author.messages
      const newMsg: Message = Message.newMessage(isSend, cp, msgs.length, cont, originalCont)
      msgs.push(newMsg);
      return newMsg;
    } else {
      this.alertService.alert('No conversation partners found');
      return undefined;
    }
  }

  isAddNewMessageDisabled(): boolean {
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
      this.alertService.alert('Position and msg timing do not fit for the message with content \'' + msg.content );
      return false;
    }
    return true;
  }

  addRepetition(rec: ReceiveMessage, info: Information) {
    rec.addRepetition(info) //todo handle error, maybe alert?
  }

  deleteRepetition(rec: ReceiveMessage, info: Information) {
    rec.removeRepetition(info)
  }

  addUsage(send: SendMessage, info: Information) {
    send.addUsage(info)
  }

  deleteUsage(send: SendMessage, info: Information) {
    send.removeUsage(info)
  }
  //************** Infos ************************

  deleteInfo(info: Information) {
    const infos = this.getRightInfoList(info)
    info.destruct()
    ListUpdater.removeFromList(info, infos)
  }

  duplicateInfo(info: Information): Information {
    const infos = this.getRightInfoList(info)
    const newInfo = info.duplicate()
    newInfo.position = LayoutingService.bbForInfoDuplication(info)
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
    const preknowledge: Preknowledge = new Preknowledge("New preknowledge", false, LayoutingService.bbForPreknowledge(LayoutingService.positionForNewPreknowledge), [], [], 0.5, 0.5, 0.5, 0.5);
    this.conversation.author.preknowledge.push(preknowledge);
    return preknowledge;
  }

  isAddNewNewInfoDisabled(): boolean {
    return !this.getFirstReceive();
  }

  addNewNewInfo(causeMsg?: ReceiveMessage): NewInformation | undefined {
    let source = causeMsg? causeMsg : this.getFirstReceive()
    if (source) {
      return new NewInformation(source, 'New Information', false, LayoutingService.bbForNewInfo(source.generates.length), [], [], 0.5, 0.5, 0.5, 0.5);
    } else {
      this.alertService.alert('No receive messages found');
      return undefined;
    }
  }

  changeInfoSource(info: NewInformation, newSrc: ReceiveMessage) {
    info.source = newSrc
  }
  //***************** information links ********************

  isLinkCreationDisabled() {
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
    return new InformationLink(src, target, type, text);
  }

  deleteLink(link: InformationLink) {
    link.destruct()
  }

  duplicateLink(link: InformationLink) {
    new InformationLink(link.source, link.target, link.type, link.linkText)
 }

}
