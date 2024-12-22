import {ConversationPartner} from "./conversation-partner";

import {
  MessageJson,
  ReceiveMessageJson,
  SendMessageJson,
} from "../json/sequence-diagram-models";
import {
  InformationJson,
  PreknowledgeJson,
  NewInformationJson,
  InformationLinkType,
  InformationLinkJson,
} from "../json/knowledge-models";
import {Ref} from "./parser/ref";
import {ParserContext} from "./parser/parser-context";
import {Referencable} from "./parser/referenceable";
import {JsonFixer} from "./parser/json-fixer";
import {BoundingBox} from "../graphical/bounding-box";

export abstract class Message extends Referencable {
  protected readonly eClass: string = '';
  static eClass = 'http://www.unikoblenz.de/keml#//Message'
  counterPart: ConversationPartner;
  timing: number = 0;
  content: string;
  originalContent?: string;

  protected constructor(
    counterPart: ConversationPartner,
    timing: number,
    content: string,
    originalContent?: string,
    ref?: Ref, parserContext?: ParserContext, jsonOpt?: MessageJson,
  ) {
    super(ref);
    if(parserContext) {
      parserContext.put(this)
      let json: MessageJson = jsonOpt? jsonOpt: parserContext.getJsonFromTree(ref!.$ref);
      this.counterPart = parserContext.getOrCreate(json.counterPart)
      this.timing = json.timing? json.timing : 0;
      this.content = json.content;
      this.originalContent = json.originalContent;
    } else {
      this.counterPart = counterPart;
      this.timing = timing;
      this.content = content;
      this.originalContent = originalContent;

      this.ref = new Ref('', this.eClass);
    }
  }

  static isSend(eClass: string) {
    return eClass.endsWith("SendMessage");
  }

  isSend(): boolean {
    return Message.isSend(this.eClass);
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

  static newFromContext(ref: Ref, json: MessageJson, parserContext: ParserContext): any {
    let dummyCp = new ConversationPartner() //todo not nice
    if(Message.isSend(json.eClass)) {
      return new SendMessage(dummyCp, 0, undefined, undefined, undefined,
        ref, parserContext, (json as SendMessageJson)
        )
    } else {
      return new ReceiveMessage(dummyCp, 0, undefined, undefined, undefined, undefined, undefined,
        ref, parserContext, (json as ReceiveMessageJson)
      )
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
    if (!msgC.isSend()) {
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
  static override readonly eClass: string = 'http://www.unikoblenz.de/keml#//SendMessage'
  override readonly eClass: string = "http://www.unikoblenz.de/keml#//SendMessage";
  uses: Information[];

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content: string = 'New send content',
    originalContent?: string,
    uses: Information[] = [],
    ref?: Ref, parserContext?: ParserContext, jsonOpt?: SendMessageJson,
  ) {
    let resRef = ref? ref : new Ref('')
    resRef.eClass = SendMessage.eClass
    super(
      counterPart,
      timing,
      content,
      originalContent,
      resRef,
      parserContext,
      jsonOpt
    );
    if (parserContext) {
      //parserContext.put(this) // already done in super
      let json: SendMessageJson = jsonOpt ? jsonOpt : parserContext?.getJsonFromTree(ref!.$ref);
      let uses = json.uses? json.uses : []
      this.uses = uses.map(u => parserContext.getOrCreate(u))
    } else {
      this.uses = uses
    }
  }

  override toJson(): SendMessageJson {
    let res = (<SendMessageJson>super.toJson());
    res.uses = this.uses.map(u => u.getRef())
    return res;
  }

}

export class ReceiveMessage extends Message {
  override readonly eClass: string = "http://www.unikoblenz.de/keml#//ReceiveMessage";
  static override readonly eClass: string = 'http://www.unikoblenz.de/keml#//ReceiveMessage'
  static readonly generatesPrefix: string = 'generates';
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
    ref?: Ref, parserContext?: ParserContext, jsonOpt?: ReceiveMessageJson,
  ) {
    super(
      counterPart,
      timing,
      content? content: "New receive content",
      originalContent,
      ref, parserContext, jsonOpt
    );
    if (parserContext) {
      let json: ReceiveMessageJson = jsonOpt ? jsonOpt : parserContext.getJsonFromTree(ref!.$ref)
      console.log(json)
      let generatesRefs = ParserContext.createRefList2(ref!.$ref, ReceiveMessage.generatesPrefix, json.generates?.map(g => g.eClass? g.eClass: NewInformation.eClass))
      this.generates = generatesRefs.map(g => parserContext.getOrCreate(g))
      let reps = json.repeats?.map(r => parserContext.getOrCreate<NewInformation>(r))
      this.repeats = reps ? reps : []
      this.isInterrupted = json.isInterrupted;
    } else {
      this.addGenerates(generates);
      this.repeats = repeats;
      this.isInterrupted = isInterrupted;
//    this.ref = new Ref('', this.eClass)
    }
    this.listChildren.set(ReceiveMessage.generatesPrefix, this.generates)
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
  position: BoundingBox;
  initialTrust: number;
  currentTrust: number;

  causes: InformationLink[];
  static readonly causesPrefix: string = 'causes'
  targetedBy: InformationLink[]; //todo avoid?

  isUsedOn: SendMessage[];
  repeatedBy: ReceiveMessage[];


  protected constructor(message: string, isInstruction: boolean = false, position?: BoundingBox,
                        initialTrust: number = 0.5, currentTrust: number = 0.5,
                        causes: InformationLink[] = [], targetedBy: InformationLink[] = [],
                        isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
                        ref?: Ref, parserContext?: ParserContext, jsonOpt?: InformationJson
                        ) {
    super(ref);
    if (parserContext) {
      parserContext.put(this)
      let json: InformationJson = jsonOpt ? jsonOpt : parserContext.getJsonFromTree(ref!.$ref)
      this.message = json.message;
      this.isInstruction = json.isInstruction;
      this.position = json.position? json.position : new BoundingBox();
      this.initialTrust = json.initialTrust;
      this.currentTrust = json.currentTrust;
      //todo actually, causes should exist on the json, however, it is missing and we hence set it manually:
      let causesRefs = ParserContext.createRefList2(ref!.$ref, Information.causesPrefix, json.causes?.map(c => c.eClass? c.eClass : InformationLink.eClass))
      this.causes = causesRefs.map(r => parserContext.getOrCreate<InformationLink>(r))
      this.targetedBy = json.targetedBy?.map(r =>  parserContext.getOrCreate(r))
      this.isUsedOn = json.isUsedOn?.map(r => parserContext.getOrCreate<SendMessage>(r))
      this.repeatedBy = json.repeatedBy?.map(r => parserContext.getOrCreate<ReceiveMessage>(r))
    } else {
      this.message = message;
      this.isInstruction = isInstruction;
      this.position = position? position: new BoundingBox();
      this.initialTrust = initialTrust;
      this.currentTrust = currentTrust;
      this.causes = causes;
      this.targetedBy = targetedBy;
      this.isUsedOn = isUsedOn;
      this.repeatedBy = repeatedBy;
    }
    this.listChildren.set(Information.causesPrefix, this.causes)
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
      position: this.position,
    }
  }
}

export class NewInformation extends Information {
  static eClass: string = 'http://www.unikoblenz.de/keml#//NewInformation'
  source: ReceiveMessage;

  constructor(source: ReceiveMessage,
              message: string, isInstruction: boolean = false,  position?: BoundingBox,
              initialTrust: number = 0.5, currentTrust: number = 0.5,
              causes: InformationLink[] = [], targetedBy: InformationLink[] = [],
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              ref?: Ref, parserContext?: ParserContext, jsonOpt?: NewInformationJson
  ) {
    super(message, isInstruction, position,
      initialTrust, currentTrust,
      causes, targetedBy,
      isUsedOn, repeatedBy,
      ref, parserContext, jsonOpt);
    if(parserContext) {
      let json: NewInformationJson = jsonOpt ? jsonOpt : parserContext.getJsonFromTree(ref!.$ref)
      //todo this works against a bug in the used json lib: it computes the necessary source if it is not present
      let src = json.source? json.source : new Ref(Ref.getParentAddress(ref!.$ref), ReceiveMessage.eClass)
      this.source = parserContext.getOrCreate(src)
    } else {
      this.source = source;
    }
  }

  static fromJson(newInfo: NewInformationJson, source: ReceiveMessage): NewInformation {
    return new NewInformation(source, newInfo.message, newInfo.isInstruction)
  }

  override duplicate(): NewInformation {
    return new NewInformation(
      this.source,
      'Copy of '+this.message,
      this.isInstruction,
      this.position,  //todo use layout helper?
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

  static readonly eClass: string = 'http://www.unikoblenz.de/keml#//PreKnowledge';

  constructor(message: string = 'Preknowledge', isInstruction: boolean = false,  position?: BoundingBox,
              initialTrust: number = 0.5, currentTrust: number = 0.5,
              causes: InformationLink[] = [], targetedBy: InformationLink[] = [],
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              ref?: Ref, parserContext?: ParserContext, jsonOpt?: PreknowledgeJson) {
    super(message, isInstruction, position,
      initialTrust, currentTrust,
      causes, targetedBy,
      isUsedOn, repeatedBy,
      ref, parserContext, jsonOpt,
      );
  }

  override duplicate(): Preknowledge {
    return new Preknowledge(
      'Copy of '+this.message,
      this.isInstruction,
      this.position,  //todo use layout helper?
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
  static readonly eClass = 'http://www.unikoblenz.de/keml#//InformationLink'

  source: Information;
  target: Information;
  type: InformationLinkType;
  linkText?: string;

  constructor(source: Information, target: Information, type: InformationLinkType, linkText?: string,
              ref?: Ref, parserContext?: ParserContext, jsonOpt?: InformationLinkJson
  ) {
    super(ref);
    if(parserContext) {
      parserContext.put(this)
      let json: InformationLinkJson = jsonOpt ? jsonOpt : parserContext.getJsonFromTree(ref!.$ref)
      //todo this works against a bug in the used json lib: it computes the necessary source if it is not present
      let src = json.source? json.source : new Ref(Ref.getParentAddress(ref!.$ref), JsonFixer.determineParentInfoClass(ref!.$ref))
      this.source = parserContext.getOrCreate(src)
      this.target = parserContext.getOrCreate(json.target);
      this.type = json.type;
      this.linkText = json.linkText;
    } else {
      this.source = source;
      this.target = target;
      this.type = type;
      this.linkText = linkText;
    }
  }

  toJson(): InformationLinkJson {
    return {
      eClass: InformationLink.eClass,
      source: this.source.getRef(),
      target: this.target.getRef(),
      type: this.type,
      linkText: this.linkText,
    }
  }

}

