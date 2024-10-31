import {ConversationPartner} from "./conversation-partner";
import {IOHelper} from "./iohelper";

import {Message as MessageJson} from "../sequence-diagram-models";
import {Preknowledge as PreknowledgeJson} from "../knowledge-models";

export abstract class Message {
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

  static newMessage(isSend: boolean, counterPart: ConversationPartner, timing: number, content: string, originalContent: string = 'Original content'): Message {
    if (isSend) {
      return new SendMessage(counterPart, timing, content, originalContent)
    } else {
      return new ReceiveMessage(counterPart, timing, content, originalContent)
    }
  }

  static fromJSON(msg: MessageJson, conversationPartners: ConversationPartner[]): Message {
    //deal with unexpected undefined for timing 0:
    let timing = msg.timing;
    if (!timing) {
      timing = 0;
    }
    let counterPart: ConversationPartner = conversationPartners[IOHelper.getIndexFromString(msg.counterPart.$ref)];
    return Message.newMessage(this.isSend(msg.eClass), counterPart, timing, msg.content, msg.originalContent)
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

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content: string = 'New send content',
    originalContent?: string,
  ) {
    super(
      counterPart,
      timing,
      content,
      originalContent
    );
  }

}


export class ReceiveMessage extends Message {
  override readonly eClass: string = "http://www.unikoblenz.de/keml#//ReceiveMessage";
  generates: NewInformation[];
  isInterrupted: boolean = false;

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content?: string,
    originalContent?: string,
    generates: NewInformation[] = [],
    isInterrupted: boolean = false,
  ) {
    super(
      counterPart,
      timing,
      content? content: "New receive content",
      originalContent
    );
    this.generates = generates;
    this.isInterrupted = isInterrupted;
  }

}


export abstract class Information {

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
}

export class InformationLink {
  source: Information;
  target: Information;

  constructor(source: Information, target: Information) {
    this.source = source;
    this.target = target;
  }
}

