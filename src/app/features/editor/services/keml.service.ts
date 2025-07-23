import {Injectable} from '@angular/core';
import {
  Information,
  InformationLink,
  Message,
  NewInformation,
  Preknowledge,
  ReceiveMessage, SendMessage,
} from "@app/shared/keml/models/core/msg-info";
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {LayoutHelper} from "../utils/layout-helper";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";
import {Author} from "@app/shared/keml/models/core/author";
import {ListUpdater} from "@app/core/utils/list-updater";
import {MsgPositionChangeService} from "@app/features/editor/services/msg-position-change.service";

@Injectable({
  providedIn: 'root'
})
export class KemlService {

  public conversation!: Conversation;

  constructor(
    private msgPositionChangeService: MsgPositionChangeService,
  ) {
    this.conversation = new Conversation();
    LayoutHelper.positionConversationPartners(this.conversation.conversationPartners)
  }

  assignConversation(conversation: Conversation) {
    this.conversation = conversation;
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
    LayoutHelper.positionConversationPartners(cps); // complete re-positioning
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

  disableMoveUp(msg: Message): boolean {
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

  disableMoveDown(msg: Message): boolean {
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
      console.error(errormsg)
      throw errormsg;
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
      if(rec.repeats.indexOf(info) == -1 ) {
        rec.repeats.push(info)
      }
      if(info.repeatedBy.indexOf(rec) == -1) {
        info.repeatedBy.push(rec)
      }
    } else {
      console.log('No repetition allowed')
    }
  }

  deleteRepetition(rec: ReceiveMessage, info: Information) {
    ListUpdater.removeFromList(info, rec.repeats)
    ListUpdater.removeFromList(rec, info.repeatedBy)
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
    ListUpdater.removeFromList(info, send.uses)
    ListUpdater.removeFromList(send, info.isUsedOn)
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
    newInfo.position = LayoutHelper.bbForInfoDuplication(info)
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
    const preknowledge: Preknowledge = new Preknowledge("New preknowledge", false, LayoutHelper.bbForPreknowledge(LayoutHelper.positionForNewPreknowledge), [], [], [], [], 0.5, 0.5, 0.5, 0.5);
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
      return new NewInformation(source, 'New Information', false, LayoutHelper.bbForNewInfo(source.generates.length), [], [], [], [], 0.5, 0.5, 0.5, 0.5);
    } else {
      console.error('No receive messages found');
      return undefined;
    }
  }

  changeInfoSource(info: NewInformation, newSrc: ReceiveMessage) {
    info.source = newSrc
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
