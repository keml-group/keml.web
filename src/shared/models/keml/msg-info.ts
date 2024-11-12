import {ConversationPartner} from "./conversation-partner";

import {Message as MessageJson} from "../sequence-diagram-models";
import {ReceiveMessage as ReceiveMessageJson, SendMessage as SendMessageJson} from "../sequence-diagram-models";
import {Information as InformationJson} from "../knowledge-models";
import {NewInformation as NewInformationJson} from "../knowledge-models";
import {Preknowledge as PreknowledgeJson} from "../knowledge-models";
import {InformationLinkType, InformationLink as InformationLinkJson} from "../knowledge-models";
import {Ref} from "./parser/ref";
import {ParserContext} from "./parser/parser-context";
import {Referencable} from "./parser/referenceable";

export abstract class Message extends Referencable{
  protected readonly eClass: string = '';
  counterPart: ConversationPartner;
  timing: number = 0;
  content: string;
  originalContent?: string;

  protected constructor(
    counterPart: ConversationPartner,
    timing: number,
    content: string,
    originalContent?: string,
  ) {
    super();
    this.counterPart = counterPart;
    this.timing = timing;
    this.content = content;
    this.originalContent = originalContent;
  }

  static isSend(eClass: string) {
    return eClass.endsWith("SendMessage");
  }

  isSend(): boolean {
    return Message.isSend(this.eClass);
  }

  prepare(ownPos: string) {
    this.ref = new Ref(ownPos, this.eClass);
  }

  toJson(): MessageJson {
    return {
      content: this.content,
      counterPart: this.counterPart.getRef(),
      eClass: this.eClass,
      originalContent: this.originalContent,
      timing: this.timing
    }
  }

  static newMessage(isSend: boolean, counterPart: ConversationPartner, timing: number, content: string, originalContent: string = 'Original content'): Message {
    if (isSend) {
      return new SendMessage(counterPart, timing, content, originalContent)
    } else {
      return new ReceiveMessage(counterPart, timing, content, originalContent)
    }
  }

  static fromJSON(msg: MessageJson, context: ParserContext): Message {
    //deal with unexpected undefined for timing 0:
    let timing = msg.timing;
    if (!timing) {
      timing = 0;
    }
    let counterPart: ConversationPartner = context.get(msg.counterPart.$ref);
    let msgC =  Message.newMessage(this.isSend(msg.eClass), counterPart, timing, msg.content, msg.originalContent)
    if (msgC.isSend()) {

    } else {
      let receive = msgC as ReceiveMessage
      let infos = (msg as ReceiveMessageJson).generates
      let generated: NewInformation[] = infos?.map(info => NewInformation.fromJson(info, receive))
      context.putList('todo', 'generates', generated)
      receive.addGenerates(generated)
    }
    return msgC
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
      let duplicate = Message.newMessage(msg.isSend(), msg.counterPart, msg.timing+1, 'Duplicate of '+ msg.content, msg.originalContent);
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

export class SendMessage extends Message {
  override readonly eClass: string = "http://www.unikoblenz.de/keml#//SendMessage";
  uses: Information[];

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content: string = 'New send content',
    originalContent?: string,
    uses: Information[] = [],
  ) {
    super(
      counterPart,
      timing,
      content,
      originalContent
    );
    this.uses = uses
  }

  override toJson(): SendMessageJson {
    let res = (<SendMessageJson>super.toJson());
    res.uses = this.uses.map(u => u.getRef())
    return res;
  }

}


export class ReceiveMessage extends Message {
  override readonly eClass: string = "http://www.unikoblenz.de/keml#//ReceiveMessage";
  generates: NewInformation[] = [];
  repeats: NewInformation[] = [];
  isInterrupted: boolean = false;

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content?: string,
    originalContent?: string,
    generates: NewInformation[] = [],
    repeats: NewInformation[] = [],
    isInterrupted: boolean = false,
  ) {
    super(
      counterPart,
      timing,
      content? content: "New receive content",
      originalContent
    );
    this.addGenerates(generates);
    this.repeats = repeats;
    this.isInterrupted = isInterrupted;
  }

  // does both directions (source and generates)
  addGenerates(generated: NewInformation[]) {
    generated?.forEach(info => {
      if(info.source != this) {
        info.source?.removeFromGenerates(info)
        info.source = this;
      }
      if (this.generates.findIndex(i => i == info)==-1)//todo can duplicates exist
        this.generates.push(info)
    })
  }

  private removeFromGenerates(info: NewInformation): boolean {
    let pos = this.generates.findIndex(i => i == info)
    if (pos != -1) {
      this.generates.splice(pos, 1)
      return true;
    }
    return false;
  }

  override prepare(ownPos: string) {
    super.prepare(ownPos);
    const generatesPrefix = Ref.computePrefix(ownPos, 'generates')
    Referencable.prepareList(generatesPrefix, this.generates)
  }

  override toJson(): ReceiveMessageJson {
    let res = (<ReceiveMessageJson>super.toJson());
    res.generates = this.generates.map(g => g.toJson())
    res.repeats = this.repeats.map(r => r.getRef())
    return res;
  }


}


export abstract class Information extends Referencable {

  eClass = '';
  message: string;
  isInstruction: boolean;
  x: number = 0;
  y: number = 0;
  initialTrust: number;
  currentTrust: number;

  causes: InformationLink[]; //todo avoid?
  targetedBy: InformationLink[]; //todo avoid?

  isUsedOn: SendMessage[];
  repeatedBy: ReceiveMessage[];


  protected constructor(message: string, isInstruction: boolean = false,  x: number = 0, y: number = 0,
                        initialTrust: number = 0.5, currentTrust: number = 0.5,
                        causes: InformationLink[] = [], targetedBy: InformationLink[] = [],
                        isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],) {
    super();
    this.message = message;
    this.isInstruction = isInstruction;
    this.x = x;
    this.y = y;
    this.initialTrust = initialTrust;
    this.currentTrust = currentTrust;
    this.causes = causes;
    this.targetedBy = targetedBy;
    this.isUsedOn = isUsedOn;
    this.repeatedBy = repeatedBy;
  }

  prepare(ownPos: string): void {
    this.ref = new Ref(ownPos, this.eClass)
    Referencable.prepareList(Ref.computePrefix(ownPos, 'causes'), this.causes)
  }

  abstract duplicate(): Information;

  toJson(): InformationJson {
    return {
      causes: this.causes.map(c => c.toJson()),
      currentTrust: this.currentTrust,
      eClass: this.eClass,
      initialTrust: this.initialTrust,
      isInstruction: this.isInstruction,
      isUsedOn: Referencable.listToRefs(this.isUsedOn),
      message: this.message,
      repeatedBy:  Referencable.listToRefs(this.repeatedBy),
      targetedBy:  Referencable.listToRefs(this.targetedBy),
      x: this.x,
      y: this.y
    }
  }
}

export class NewInformation extends Information {
  source: ReceiveMessage;

  constructor(source: ReceiveMessage,
              message: string, isInstruction: boolean = false,  x: number = 0, y: number = 0,
              initialTrust: number = 0.5, currentTrust: number = 0.5,
              causes: InformationLink[] = [], targetedBy: InformationLink[] = [],
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],) {
    super(message, isInstruction, x, y,
      initialTrust, currentTrust,
      causes, targetedBy,
      isUsedOn, repeatedBy,);
    this.source = source;
  }

  static fromJson(newInfo: NewInformationJson, source: ReceiveMessage): NewInformation {
    return new NewInformation(source, newInfo.message, newInfo.isInstruction)
  }

  override duplicate(): NewInformation {
    return new NewInformation(
      this.source,
      'Copy of '+this.message,
      this.isInstruction,
      this.x,  //todo use layout helper?
      this.y,  //todo use layout helper?
      this.initialTrust,
      this.currentTrust,
      //todo none of these are currently set (they are bidirectional)
    );
  }

  override toJson(): NewInformationJson {
    let res = (<NewInformationJson>super.toJson());
    res.source = this.source.getRef()
    return res;
  }
}

export class Preknowledge extends Information {

  constructor(message: string, isInstruction: boolean = false,  x: number = 0, y: number = 0,
              initialTrust: number = 0.5, currentTrust: number = 0.5,
              causes: InformationLink[] = [], targetedBy: InformationLink[] = [],
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],) {
    super(message, isInstruction, x, y,
      initialTrust, currentTrust,
      causes, targetedBy,
      isUsedOn, repeatedBy,);
  }

  static fromJSON(pre: PreknowledgeJson): Preknowledge {
    return new Preknowledge(pre.message, pre.isInstruction);
  }

  override duplicate(): Preknowledge {
    return new Preknowledge(
      'Copy of '+this.message,
      this.isInstruction,
      this.x,  //todo use layout helper?
      this.y,  //todo use layout helper?
      this.initialTrust,
      this.currentTrust,
      //todo none of these are currently set (they are bidirectional)
    );
  }

  override toJson(): PreknowledgeJson {
    return (<PreknowledgeJson>super.toJson())
  }
}

export class InformationLink extends Referencable {
  source: Information;
  target: Information;
  type: InformationLinkType;
  linkText?: string;

  constructor(source: Information, target: Information, type: InformationLinkType, linkText?: string) {
    super();
    this.source = source;
    this.target = target;
    this.type = type;
    this.linkText = linkText;
  }

  prepare(ownPos: string): void {
    this.ref = new Ref(ownPos); //todo no eclass
  }

  toJson(): InformationLinkJson {
    return {
      source: this.source.getRef(),
      target: this.target.getRef(),
      type: this.type,
      linkText: this.linkText,
    }
  }

}

