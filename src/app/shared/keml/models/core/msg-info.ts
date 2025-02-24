import {ConversationPartner} from "./conversation-partner";
import {
  MessageJson,
  ReceiveMessageJson,
  SendMessageJson,
} from "@app/shared/keml/models/json/sequence-diagram-models";
import {
  InformationJson,
  PreknowledgeJson,
  NewInformationJson,
  InformationLinkType,
  InformationLinkJson,
} from "@app/shared/keml/models/json/knowledge-models";
import {Ref} from "@app/shared/keml/models/refs/ref";
import {Parser} from "@app/shared/keml/parser/parser";
import {Referencable} from "@app/shared/keml/models/refs/referenceable";
import {BoundingBox} from "@app/core/features/arrows/models/bounding-box";
import {GeneralHelper} from "@app/core/utils/general-helper";
import {PositionHelper} from "@app/core/features/arrows/utils/position-helper";

export abstract class Message extends Referencable {
  static eClass = 'http://www.unikoblenz.de/keml#//Message'
  counterPart: ConversationPartner;
  timing: number = 0;
  content: string;
  originalContent?: string;

  protected constructor(
    ref: Ref,
    counterPart: ConversationPartner,
    timing: number,
    content: string,
    originalContent?: string, parser?: Parser, jsonOpt?: MessageJson,
  ) {
    super(ref);
    if(parser) {
      parser.put(this)
      let json: MessageJson = jsonOpt? jsonOpt: parser.getJsonFromTree(ref!.$ref);
      this.counterPart = parser.getOrCreate(json.counterPart)
      this.timing = json.timing? json.timing : 0;
      this.content = json.content;
      this.originalContent = json.originalContent;
    } else {
      this.counterPart = counterPart;
      this.timing = timing;
      this.content = content;
      this.originalContent = originalContent;
    }
  }

  static isSend(eClass: string) {
    return eClass.endsWith("SendMessage");
  }

  isSend(): boolean {
    return Message.isSend(this.ref.eClass);
  }

  toJson(): MessageJson {
    return {
      content: this.content,
      counterPart: this.counterPart.getRef(),
      eClass: this.ref.eClass,
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

}

export class SendMessage extends Message {
  static override readonly eClass: string = 'http://www.unikoblenz.de/keml#//SendMessage'
  uses: Information[];

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content: string = 'New send content',
    originalContent?: string,
    uses: Information[] = [],
    ref?: Ref, parser?: Parser, jsonOpt?: SendMessageJson,
  ) {
    let refC = Ref.createRef(SendMessage.eClass, ref)
    super(refC, counterPart, timing, content, originalContent, parser, jsonOpt);
    if (parser) {
      //parser.put(this) // already done in super
      let json: SendMessageJson = jsonOpt ? jsonOpt : parser?.getJsonFromTree(ref!.$ref);
      let uses = json.uses? json.uses : []
      this.uses = uses.map(u => parser.getOrCreate(u))
    } else {
      this.uses = uses
    }
  }

  override toJson(): SendMessageJson {
    let res = (<SendMessageJson>super.toJson());
    res.uses = this.uses.map(u => u.getRef())
    return res;
  }

  override destruct() {
    this.uses.forEach(info => {
      GeneralHelper.removeFromList(this, info.isUsedOn)
    })
    super.destruct()
  }

}

export class ReceiveMessage extends Message {
  static override readonly eClass: string = 'http://www.unikoblenz.de/keml#//ReceiveMessage'
  static readonly generatesPrefix: string = 'generates';
  generates: NewInformation[] = [];
  repeats: Information[] = [];
  isInterrupted: boolean = false;

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content?: string,
    originalContent?: string,
    generates: NewInformation[] = [],
    repeats: Information[] = [],
    isInterrupted: boolean = false,
    ref?: Ref, parser?: Parser, jsonOpt?: ReceiveMessageJson,
  ) {
    let refC = Ref.createRef(ReceiveMessage.eClass, ref)
    super(refC, counterPart, timing, content ? content : "New receive content", originalContent, parser, jsonOpt);
    if (parser) {
      let json: ReceiveMessageJson = jsonOpt ? jsonOpt : parser.getJsonFromTree(ref!.$ref)
      let generatesRefs = Parser.createRefList(ref!.$ref, ReceiveMessage.generatesPrefix, json.generates?.map(g => g.eClass? g.eClass: NewInformation.eClass))
      this.generates = generatesRefs.map(g => parser.getOrCreate(g))
      let reps = json.repeats?.map(r => parser.getOrCreate<NewInformation>(r))
      this.repeats = reps ? reps : []
      this.isInterrupted = json.isInterrupted;
    } else {
      this.generates = generates ? generates : [];
      generates?.forEach(info => {
        info.source = this
      })
      this.repeats = repeats;
      this.isInterrupted = isInterrupted;
    }
    this.listChildren.set(ReceiveMessage.generatesPrefix, this.generates)
  }

  override toJson(): ReceiveMessageJson {
    let res = (<ReceiveMessageJson>super.toJson());
    res.generates = this.generates.map(g => g.toJson())
    res.repeats = this.repeats.map(r => r.getRef())
    res.isInterrupted = this.isInterrupted
    return res;
  }

  override destruct() {
    this.repeats.forEach(info => {
      GeneralHelper.removeFromList(this, info.repeatedBy)
    })
    this.generates.forEach(info => {
      info.destruct()
    })
    super.destruct()
  }

}


export abstract class Information extends Referencable {

  message: string;
  isInstruction: boolean;
  position: BoundingBox;
  initialTrust: number | undefined;
  currentTrust: number | undefined;
  feltTrustImmediately: number | undefined;
  feltTrustAfterwards: number | undefined;

  causes: InformationLink[];
  static readonly causesPrefix: string = 'causes'
  targetedBy: InformationLink[]; //todo avoid?

  isUsedOn: SendMessage[];
  repeatedBy: ReceiveMessage[];


  protected constructor(ref: Ref, message: string, isInstruction: boolean = false,
              position?: BoundingBox, causes: InformationLink[] = [], targetedBy: InformationLink[] = [], isUsedOn: SendMessage[] = [],
              repeatedBy: ReceiveMessage[] = [], initialTrust?: number,
              currentTrust?: number, feltTrustImmediately?: number,
              feltTrustAfterwards?: number, parser?: Parser, jsonOpt?: InformationJson
  ) {
    super(ref);
    if (parser) {
      parser.put(this)
      let json: InformationJson = jsonOpt ? jsonOpt : parser.getJsonFromTree(ref!.$ref)
      this.message = json.message;
      this.isInstruction = json.isInstruction? json.isInstruction : false;
      this.position = json.position? json.position : PositionHelper.newBoundingBox();
      this.initialTrust = json.initialTrust;
      this.currentTrust = json.currentTrust;
      this.feltTrustImmediately = json.feltTrustImmediately;
      this.feltTrustAfterwards = json.feltTrustAfterwards;
      //todo actually, causes should exist on the json, however, it is missing and we hence set it manually:
      let causesRefs = Parser.createRefList(ref!.$ref, Information.causesPrefix, json.causes?.map(c => c.eClass? c.eClass : InformationLink.eClass))
      this.causes = causesRefs.map(r => parser.getOrCreate<InformationLink>(r))
      this.targetedBy = json.targetedBy? json.targetedBy.map(r =>  parser.getOrCreate(r)) : []
      this.isUsedOn = json.isUsedOn? json.isUsedOn.map(r => parser.getOrCreate<SendMessage>(r)): []
      this.repeatedBy = json.repeatedBy? json.repeatedBy.map(r => parser.getOrCreate<ReceiveMessage>(r)): []
    } else {
      this.message = message;
      this.isInstruction = isInstruction;
      this.position = position? position: PositionHelper.newBoundingBox();
      this.initialTrust = initialTrust;
      this.currentTrust = currentTrust;
      this.feltTrustImmediately = feltTrustImmediately;
      this.feltTrustAfterwards = feltTrustAfterwards;
      this.causes = causes? causes : [];
      this.targetedBy = targetedBy? targetedBy: [];
      this.isUsedOn = isUsedOn ? isUsedOn : [];
      this.repeatedBy = repeatedBy? repeatedBy: [];
    }
    this.listChildren.set(Information.causesPrefix, this.causes)
  }

  abstract duplicate(): Information;

  toJson(): InformationJson {
    return {
      causes: this.causes.map(c => c.toJson()),
      currentTrust: this.currentTrust,
      eClass: this.ref.eClass,
      initialTrust: this.initialTrust,
      feltTrustImmediately: this.feltTrustImmediately,
      feltTrustAfterwards: this.feltTrustAfterwards,
      isInstruction: this.isInstruction,
      isUsedOn: Referencable.listToRefs(this.isUsedOn),
      message: this.message,
      repeatedBy:  Referencable.listToRefs(this.repeatedBy),
      targetedBy:  Referencable.listToRefs(this.targetedBy),
      position: this.position,
    }
  }

  override destruct() {
    this.repeatedBy.forEach((rec: ReceiveMessage) => {
      GeneralHelper.removeFromList(this, rec.repeats)
    })
    this.isUsedOn.forEach((send: SendMessage) => {
      GeneralHelper.removeFromList(this, send.uses)
    })
    this.targetedBy.forEach((link: InformationLink) => {
      link.destruct()
    })
    this.targetedBy.splice(0, this.targetedBy.length)
    super.destruct();
  }
}

export class NewInformation extends Information {
  static eClass: string = 'http://www.unikoblenz.de/keml#//NewInformation'
  private _source!: ReceiveMessage;

  constructor(source: ReceiveMessage,
              message: string, isInstruction: boolean = false, position?: BoundingBox,
              causes: InformationLink[] = [], targetedBy: InformationLink[] = [], isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              initialTrust?: number, currentTrust?: number, feltTrustImmediately?: number , feltTrustAfterwards?: number,
              ref?: Ref, parser?: Parser, jsonOpt?: NewInformationJson
  ) {
    let refC = Ref.createRef(NewInformation.eClass, ref)
    super(refC, message, isInstruction, position, causes, targetedBy, isUsedOn, repeatedBy, initialTrust, currentTrust, feltTrustImmediately, feltTrustAfterwards, parser, jsonOpt);
    if(parser) {
      let json: NewInformationJson = jsonOpt ? jsonOpt : parser.getJsonFromTree(ref!.$ref)
      //todo this works against a bug in the used json lib: it computes the necessary source if it is not present
      let src = json.source? json.source : new Ref(Ref.getParentAddress(ref!.$ref), ReceiveMessage.eClass)
      this._source = parser.getOrCreate(src)
    } else {
      this.source = source
    }
  }

  override duplicate(): NewInformation {
    return new NewInformation(this._source, 'Copy of ' + this.message, this.isInstruction, this.position, [], [], [], [], this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  // does both directions (source and generates)
  set source(rec: ReceiveMessage) {
    if (this._source != rec) {
      GeneralHelper.removeFromList(this, this._source?.generates)
      this._source = rec
      if(rec.generates.indexOf(this ) == -1)
        rec.generates.push(this)
    }
  }

  get source(): ReceiveMessage {
    return this._source
  }

  override toJson(): NewInformationJson {
    let res = (<NewInformationJson>super.toJson());
    res.source = this._source.getRef()
    return res;
  }

  override destruct() {
    GeneralHelper.removeFromList(this, this._source.generates)
    super.destruct();
  }
}

export class Preknowledge extends Information {

  static readonly eClass: string = 'http://www.unikoblenz.de/keml#//PreKnowledge';

  constructor(message: string = 'Preknowledge', isInstruction: boolean = false, position?: BoundingBox,
              causes: InformationLink[] = [], targetedBy: InformationLink[] = [], isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              initialTrust?: number, currentTrust?: number,
              feltTrustImmediately?: number, feltTrustAfterwards?: number,
              ref?: Ref, parser?: Parser, jsonOpt?: PreknowledgeJson) {
    let refC = Ref.createRef(Preknowledge.eClass, ref)
    super(refC, message, isInstruction, position, causes, targetedBy, isUsedOn, repeatedBy, initialTrust, currentTrust, feltTrustImmediately, feltTrustAfterwards, parser, jsonOpt);
  }

  timeInfo(): number {
    let timing;
    if (this.isUsedOn?.length >0) {
      timing = Math.min(...this.isUsedOn.map(send => send.timing));
    } else {
      timing = 0
    }
    return timing
  }

  override duplicate(): Preknowledge {
    return new Preknowledge('Copy of ' + this.message, this.isInstruction, this.position, [], [], [], [], this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
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
              ref?: Ref, parser?: Parser, jsonOpt?: InformationLinkJson
  ) {
    let refC = Ref.createRef(InformationLink.eClass, ref)
    super(refC);
    if(parser) {
      parser.put(this)
      let json: InformationLinkJson = jsonOpt ? jsonOpt : parser.getJsonFromTree(ref!.$ref)
      //todo there is a problem with the incoming json: it does not have the link soruces. However, we solve this via 'prepareJsonInfoLinkSources' called in the loadKEML() method on modelIoService
      let src = json.source!!
      this.source = parser.getOrCreate(src)
      this.target = parser.getOrCreate(json.target);
      this.type = json.type;
      let text;
      if (json.linkText && json.linkText.length > 0) {text = json.linkText} else {text = undefined}
      this.linkText = text;
    } else {
      this.source = source;
      this.target = target;
      this.type = type;
      this.linkText = linkText;
      this.source.causes.push(this)
      this.target.targetedBy.push(this)
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

  override destruct() {
    GeneralHelper.removeFromList(this, this.source.causes)
    GeneralHelper.removeFromList(this, this.target.targetedBy)
    super.destruct();
  }

}

