import {Injectable, signal, WritableSignal} from '@angular/core';
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
import {KemlHistoryService} from "@app/shared/keml/edit/keml-history.service";

@Injectable({
  providedIn: 'root'
})
export class KemlService {

  public conversation!: Conversation;

  msgCount: WritableSignal<number>;


  constructor(
    private msgPositionChangeService: MsgPositionChangeService,
    private alertService: AlertService,
    private layoutingService: LayoutingService,
    private historyService: KemlHistoryService,
  ) {
    this.conversation = new Conversation();
    this.layoutingService.positionConversationPartners(this.conversation.conversationPartners)
    this.msgCount = signal<number>(this.conversation.author.messages.length);
    this.historyService.state$.subscribe(state => {
      if (state) {
        this.deserializeConversation(state);
      }
    });
  }

  saveCurrentState() {
    this.historyService.save(this.serializeConversation())
  }

  serializeConversation(): ConversationJson {
    return this.conversation.toJson()
  }

  newConversationNoHistory(title?: string) {
    this.conversation = new Conversation(title);
    this.msgCount.set(this.conversation.author.messages.length)
  }

  newConversation(title?: string) {
    this.newConversationNoHistory(title);
    this.saveCurrentState()
  }

  loadConversation(convJson: ConversationJson): Conversation {
    let conv = this.deserializeConversation(convJson);
    this.saveCurrentState()
    return conv;
  }

  private deserializeConversation(convJson: ConversationJson): Conversation {
    JsonFixer.prepareJsonInfoLinkSources(convJson);
    JsonFixer.addMissingSupplementType(convJson);

    let conv = Conversation.fromJSON(convJson);
    this.layoutingService.positionConversationPartners(conv.conversationPartners)
    KemlService.timeMessages(conv.author.messages)
    LayoutingService.positionInfos(conv.author.preknowledge, conv.author.messages);
    this.conversation = conv;
    this.msgCount.set(this.conversation.author.messages.length)
    return conv;
  }

  private static timeMessages(msgs: Message[]) {
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
    const cp = this.addNewConversationPartnerNoHistory(name)
    this.saveCurrentState()
    return cp;
  }

  addNewConversationPartnerNoHistory(name?: string): ConversationPartner {
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
    if (!this.isMoveConversationPartnerRightDisabled(cp)) {
      const cps = this.conversation.conversationPartners;
      const pos = cps.indexOf(cp);
      cps[pos] = cps[pos+1];
      cps[pos + 1] = cp;
      this.layoutingService.positionConversationPartners(cps);
      this.saveCurrentState()
    }
  }

  isMoveConversationPartnerLeftDisabled(cp: ConversationPartner): boolean {
    const pos = this.conversation.conversationPartners.indexOf(cp);
    return pos <= 0;
  }

  moveConversationPartnerLeft(cp: ConversationPartner) {
    if (!this.isMoveConversationPartnerLeftDisabled(cp)) {
      const cps = this.conversation.conversationPartners;
      const pos = cps.indexOf(cp);
      cps[pos] = cps[pos-1];
      cps[pos-1] = cp;
      this.layoutingService.positionConversationPartners(cps);
      this.saveCurrentState()
    }
  }

  deleteConversationPartner(cp: ConversationPartner) {
    this.deleteMsgsWithCP(cp)
    cp.destruct()
    ListUpdater.removeFromList(cp, this.conversation.conversationPartners)
    this.saveCurrentState()
  }

  private deleteMsgsWithCP(cp: ConversationPartner) {
    this.conversation.author.messages.filter(m => m.counterPart == cp).forEach(m => {
      this.deleteMessageInternally(m)
    })
    this.msgCount.set(this.conversation.author.messages.length)
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
    this.saveCurrentState()
    return newCp;
  }

  //************* Messages ********************

  moveMessageUp(msg: Message) {
    if(this.isMoveUpDisabled(msg)) {
      console.error("Cannot move message up");
    } else {
      const msgs = this.conversation.author.messages
      //actually, timing should be equal to the index - can we rely on it?
      msgs[msg.timing] = msgs[msg.timing-1];
      msgs[msg.timing].timing++;
      this.msgPositionChangeService.notifyPositionChangeMessage( msgs[msg.timing] )
      msgs[msg.timing-1] = msg;
      msg.timing--;
      this.msgPositionChangeService.notifyPositionChangeMessage( msg)
      this.saveCurrentState()
    }
  }

  isMoveUpDisabled(msg: Message): boolean {
    return msg.timing<=0;
  }

  moveMessageDown(msg: Message) {
    if(this.isMoveDownDisabled(msg)) {
      console.error("Cannot move message down");
    } else {
      const msgs = this.conversation.author.messages
      //actually, timing should be equal to the index - can we rely on it?
      msgs[msg.timing] = msgs[msg.timing+1];
      msgs[msg.timing].timing-=1;
      this.msgPositionChangeService.notifyPositionChangeMessage(msgs[msg.timing])
      msgs[msg.timing+1] = msg;
      msg.timing+=1;
      this.msgPositionChangeService.notifyPositionChangeMessage(msg)
      this.saveCurrentState()
    }
  }

  isMoveDownDisabled(msg: Message): boolean {
    return msg.timing>=this.conversation.author.messages.length-1;
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
    this.saveCurrentState()
  }

  private moveMessagesDown(start: number, afterEnd: number) {
    const msgs = this.conversation.author.messages
    for(let i = start; i < afterEnd; i++) {
      msgs[i].timing++;
      this.msgPositionChangeService.notifyPositionChangeMessage(msgs[i])
    }
  }

  private moveMessagesUp(start: number, afterEnd: number) {
    const msgs = this.conversation.author.messages
    for(let i = start; i < afterEnd; i++) {
      msgs[i].timing--;
      this.msgPositionChangeService.notifyPositionChangeMessage(msgs[i])
    }
  }

  deleteMessage(msg: Message) {
    this.deleteMessageInternally(msg)
    this.saveCurrentState()
  }

  private deleteMessageInternally(msg: Message) {
    const msgs = this.conversation.author.messages
    msg.destruct()
    ListUpdater.removeFromList(msg, msgs)
    // adapt later messages:
    this.moveMessagesUp(msg.timing, msgs.length)
    this.msgCount.update(n => n-1);
  }

  duplicateMessage(msg: Message): Message | undefined {
    if (this.msgPosFitsTiming(msg)) {
      let duplicate = Message.newMessage(msg.isSend(), msg.counterPart, msg.timing+1, 'Duplicate of '+ msg.content, msg.originalContent);
      this.insertMsgInPos(duplicate)
      this.saveCurrentState()
      return duplicate
    }
    return undefined
  }

  private msgPosFitsTiming(msg: Message): boolean {
    const msgs = this.conversation.author.messages
    if (msgs.indexOf(msg) != msg.timing) {
      this.alertService.alert('Position and msg timing do not fit for the message with content \'' + msg.content );
      return false;
    }
    return true;
  }

  private insertMsgInPos(msg: Message) {
    const msgs = this.conversation.author.messages
    msgs.splice(msg.timing, 0, msg);
    // adapt later messages:
    this.moveMessagesDown(msg.timing +1, msgs.length)
    this.msgCount.update(n => n+1);
  }

  isAddNewMessageDisabled(): boolean {
    return this.conversation.conversationPartners.length <= 0;
  }

  addNewMessage(isSend: boolean, counterPart?: ConversationPartner, content?: string, originalContent?: string): Message | undefined {
    let msg = this.addNewMessageNoHistory(isSend, counterPart, content, originalContent)
    if (msg !== undefined) {
      this.saveCurrentState()
    } else {
      this.alertService.alert('No conversation partners found');
    }
    return msg
  }

  addNewMessageNoHistory(isSend: boolean, counterPart?: ConversationPartner, content?: string, originalContent?: string): Message | undefined {
    if (this.conversation.conversationPartners.length > 0) {
      const cp = counterPart ? counterPart : this.conversation.conversationPartners[0];
      const defaultContent = isSend ? 'New send content' : 'New receive content';
      let cont = content ? content : defaultContent
      let originalCont = originalContent ? originalContent : defaultContent
      const msgs = this.conversation.author.messages
      const newMsg: Message = Message.newMessage(isSend, cp, msgs.length, cont, originalCont)
      msgs.push(newMsg);
      this.msgCount.update(n => n+1);
      return newMsg;
    } else {
      console.error('No conversation partners found');
      return undefined;
    }
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

  static isRepetitionAllowed(msg: ReceiveMessage, info: Information): boolean {
    //only allow the repetition if it connects to an earlier info
    let infoTiming = info.getTiming()
    return (infoTiming == undefined || infoTiming < msg.timing)
  }

  addRepetition(rec: ReceiveMessage, info: Information) {
    if(KemlService.isRepetitionAllowed(rec, info)) {
      rec.addRepetition(info)
      this.saveCurrentState()
    } else {
      this.alertService.alert("Repetition is not allowed")
    }
  }

  deleteRepetition(rec: ReceiveMessage, info: Information) {
    if (rec.removeRepetition(info)) {
      this.saveCurrentState()
    }
  }

  isUsageAllowed(send: SendMessage, info: Information): boolean {
    let newInfo: NewInformation = info as NewInformation;
    if (newInfo?.source !== undefined) {
      return (newInfo.getTiming() < send.timing)
    } else {
      return true
    }
  }

  addUsage(send: SendMessage, info: Information) {
    if(this.isUsageAllowed(send, info)) {
      send.addUsage(info)
      this.saveCurrentState()
    } else {
      this.alertService.alert("Usage is not allowed: it must connect an older new information with a younger message")
    }
  }

  deleteUsage(send: SendMessage, info: Information) {
    if (send.removeUsage(info)) {
      this.saveCurrentState()
    }
  }


  //************** Infos ************************
  changeInfoSource(info: NewInformation, newSrc: ReceiveMessage) {
    info.source = newSrc
    this.saveCurrentState()
  }
  
  addNewPreknowledge(): Preknowledge {
    const preknowledge: Preknowledge = new Preknowledge("New preknowledge", false, LayoutingService.bbForPreknowledge(LayoutingService.positionForNewPreknowledge));
    this.conversation.author.preknowledge.push(preknowledge);
    this.saveCurrentState()
    return preknowledge;
  }

  isAddNewNewInfoDisabled(): boolean {
    return !this.getFirstReceive();
  }

  addNewNewInfo(causeMsg?: ReceiveMessage): NewInformation | undefined {
    const source = causeMsg? causeMsg : this.getFirstReceive()
    if (source) {
      const newInfo = new NewInformation(
        source, 'New Information', false, LayoutingService.bbForNewInfo(source.generates.length)
      );
      this.historyService.save(this.conversation.toJson())
      return newInfo
    } else {
      this.alertService.alert('No receive messages found');
      return undefined;
    }
  }

  deleteInfo(info: Information) {
    const infos = this.getRightInfoList(info)
    info.destruct()
    ListUpdater.removeFromList(info, infos)
    this.saveCurrentState()
  }

  duplicateInfo(info: Information): Information {
    const infos = this.getRightInfoList(info)
    const newInfo = info.duplicate()
    newInfo.position = LayoutingService.bbForInfoDuplication(info)
    infos.push(newInfo); //todo position right after current info?
    this.saveCurrentState()
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
    let link = new InformationLink(src, target, type, text);
    this.saveCurrentState()
    return link
  }

  deleteLink(link: InformationLink) {
    link.destruct()
    this.saveCurrentState()
  }

  duplicateLink(link: InformationLink): InformationLink {
    let newlink = new InformationLink(link.source, link.target, link.type, link.linkText)
    this.saveCurrentState()
    return newlink;
  }

}
