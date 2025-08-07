import {ConversationPartner} from "./conversation-partner";
import {MessageJson, ReceiveMessageJson, SendMessageJson,} from "@app/shared/keml/models/json/sequence-diagram-models";
import {
  InformationJson,
  InformationLinkJson,
  InformationLinkType,
  NewInformationJson,
  PreknowledgeJson,
} from "@app/shared/keml/models/json/knowledge-models";
import {Deserializer, Ref, Referencable} from "emfular";
import {ListUpdater} from "emfular";
import {BoundingBox, Positionable, PositionHelper} from "ngx-svg-graphics";
import {EClasses} from "@app/shared/keml/models/eclasses";

export abstract class Message extends Referencable {
  counterPart: ConversationPartner;
  timing: number = 0;
  content: string;
  originalContent?: string;

  protected constructor(
    ref: Ref,
    counterPart: ConversationPartner,
    timing: number,
    content: string,
    originalContent?: string, deserializer?: Deserializer, jsonOpt?: MessageJson,
  ) {
    super(ref);
    if(deserializer) {
      deserializer.put(this)
      let json: MessageJson = jsonOpt? jsonOpt: deserializer.getJsonFromTree(ref!.$ref);
      this.counterPart = deserializer.getOrCreate(json.counterPart)
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
  private _uses: Information[] = [];
  get uses(): Information[] {
    return this._uses;
  }
  addUsage(info: Information) {
    if (ListUpdater.addToList(info, this._uses)) {
      info.addIsUsedOn(this)
    }
  }
  removeUsage(info: Information) {
    if (ListUpdater.removeFromList(info, this._uses)) {
      info.removeIsUsedOn(this)
    }
  }

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content: string = 'New send content',
    originalContent?: string,
    uses: Information[] = [],
    ref?: Ref, deserializer?: Deserializer, jsonOpt?: SendMessageJson,
  ) {
    let refC = Ref.createRef(EClasses.SendMessage, ref)
    super(refC, counterPart, timing, content, originalContent, deserializer, jsonOpt);
    if (deserializer) {
      //deserializer.put(this) // already done in super
      let json: SendMessageJson = jsonOpt ? jsonOpt : deserializer?.getJsonFromTree(ref!.$ref);
      json.uses?.map(u => this.addUsage(deserializer.getOrCreate(u)))
    } else {
      uses.map(u => this.addUsage(u))
    }
  }

  override toJson(): SendMessageJson {
    let res = (<SendMessageJson>super.toJson());
    res.uses = this.uses.map(u => u.getRef())
    return res;
  }

  override destruct() {
    this.uses.forEach(info => {
      ListUpdater.removeFromList(this, info.isUsedOn)
    })
    super.destruct()
  }

}

export class ReceiveMessage extends Message {
  static readonly generatesPrefix: string = 'generates';
  generates: NewInformation[] = [];
  _repeats: Information[] = [];
  get repeats(): Information[] {
    return this._repeats;
  }
  addRepetition(info: Information) {
    if(!Information.isRepetitionAllowed(this, info)) {
      throw new RangeError("Repetition is only allowed to an earlier information")
    }
    if(ListUpdater.addToList(info, this._repeats)) {
      info.addRepeatedBy(this)
    }
  }
  removeRepetition(info: Information) {
    if(ListUpdater.removeFromList(info, this._repeats)) {
      info.removeRepeatedBy(this)
    }
  }
  isInterrupted: boolean = false;

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content?: string,
    originalContent?: string,
    generates: NewInformation[] = [],
    repeats: Information[] = [],
    isInterrupted: boolean = false,
    ref?: Ref, deserializer?: Deserializer, jsonOpt?: ReceiveMessageJson,
  ) {
    let refC = Ref.createRef(EClasses.ReceiveMessage, ref)
    super(refC, counterPart, timing, content ? content : "New receive content", originalContent, deserializer, jsonOpt);
    if (deserializer) {
      let json: ReceiveMessageJson = jsonOpt ? jsonOpt : deserializer.getJsonFromTree(ref!.$ref)
      let generatesRefs = Deserializer.createRefList(ref!.$ref, ReceiveMessage.generatesPrefix, json.generates?.map(g => g.eClass? g.eClass: EClasses.NewInformation))
      this.generates = generatesRefs.map(g => deserializer.getOrCreate(g))
      json.repeats?.map(r => this.addRepetition(deserializer.getOrCreate<NewInformation>(r)))
      this.isInterrupted = json.isInterrupted;
    } else {
      this.generates = generates ? generates : [];
      generates?.forEach(info => {
        info.source = this
      })
      repeats.map(r => this.addRepetition(r));
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
      ListUpdater.removeFromList(this, info.repeatedBy)
    })
    this.generates.forEach(info => {
      info.destruct()
    })
    super.destruct()
  }

}


export abstract class Information extends Referencable implements Positionable {

  message: string;
  isInstruction: boolean;
  position: BoundingBox;
  initialTrust: number | undefined;
  currentTrust: number | undefined;
  feltTrustImmediately: number | undefined;
  feltTrustAfterwards: number | undefined;

  abstract getTiming(): number | undefined;

  private _causes: InformationLink[] = [];
  get causes(): InformationLink[] {
    return this._causes;
  }
  static readonly causesPrefix: string = 'causes'
  addCauses(link: InformationLink) {
    ListUpdater.addToList(link, this._causes)
    link.source = this
  }
  removeCauses(link: InformationLink) {
    this.removeFromListChild(link, this._causes)
  }

  private _targetedBy: InformationLink[] = []; //todo avoid?
  get targetedBy(): InformationLink[] {
    return this._targetedBy;
  }
  addTargetedBy(link: InformationLink) {
    ListUpdater.addToList(link, this._targetedBy)
    link.target = this
  }
  removeTargetedBy(link: InformationLink) {
    this.removeFromListChild(link, this._targetedBy)
  }

  private _isUsedOn: SendMessage[] = [];
  get isUsedOn(): SendMessage[] {
    return this._isUsedOn;
  }
  addIsUsedOn(send: SendMessage){
    if (ListUpdater.addToList(send, this._isUsedOn)) {
      send.addUsage(this);
    }
  }
  removeIsUsedOn(send: SendMessage){
    if (ListUpdater.removeFromList(send, this._isUsedOn)) {
      send.removeUsage(this)
    }
  }

  private _repeatedBy: ReceiveMessage[] = [];
  get repeatedBy(): ReceiveMessage[] {
    return this._repeatedBy;
  }
  static isRepetitionAllowed(msg: ReceiveMessage, info: Information): boolean {
    //only allow the repetition if it connects to an earlier info
    let infoTiming = info.getTiming()
    return (infoTiming == undefined || infoTiming < msg.timing)
  }
  addRepeatedBy(msg: ReceiveMessage) {
    if(!Information.isRepetitionAllowed(msg, this)) {
      throw new RangeError("Repetition is only allowed to an earlier information")
    }
    if(ListUpdater.addToList(msg, this._repeatedBy)) {
      msg.addRepetition(this);
    }
  }
  removeRepeatedBy(msg: ReceiveMessage) {
    if(ListUpdater.removeFromList(msg, this._repeatedBy)) {
      msg.removeRepetition(this)
    }
  }

  protected constructor(ref: Ref, message: string, isInstruction: boolean = false,
              position?: BoundingBox, isUsedOn: SendMessage[] = [],
              repeatedBy: ReceiveMessage[] = [], initialTrust?: number,
              currentTrust?: number, feltTrustImmediately?: number,
              feltTrustAfterwards?: number, deserializer?: Deserializer, jsonOpt?: InformationJson
  ) {
    super(ref);
    if (deserializer) {
      deserializer.put(this)
      let json: InformationJson = jsonOpt ? jsonOpt : deserializer.getJsonFromTree(ref!.$ref)
      this.message = json.message;
      this.isInstruction = json.isInstruction? json.isInstruction : false;
      this.position = json.position? json.position : PositionHelper.newBoundingBox();
      this.initialTrust = json.initialTrust;
      this.currentTrust = json.currentTrust;
      this.feltTrustImmediately = json.feltTrustImmediately;
      this.feltTrustAfterwards = json.feltTrustAfterwards;
      //todo actually, causes should exist on the json, however, it is missing and we hence set it manually:
      let causesRefs = Deserializer.createRefList(ref!.$ref, Information.causesPrefix, json.causes?.map(c => c.eClass? c.eClass : EClasses.InformationLink))
      causesRefs.map(r => deserializer.getOrCreate<InformationLink>(r))
      json.targetedBy?.map(r =>  deserializer.getOrCreate(r))
      json.isUsedOn?.map(r => this.addIsUsedOn(deserializer.getOrCreate<SendMessage>(r)))
      json.repeatedBy?.map(r => this.addRepeatedBy(deserializer.getOrCreate<ReceiveMessage>(r)))
    } else {
      this.message = message;
      this.isInstruction = isInstruction;
      this.position = position? position: PositionHelper.newBoundingBox();
      this.initialTrust = initialTrust;
      this.currentTrust = currentTrust;
      this.feltTrustImmediately = feltTrustImmediately;
      this.feltTrustAfterwards = feltTrustAfterwards;
      isUsedOn?.map(u => this.addIsUsedOn(u))
      repeatedBy?.map(m => this.addRepeatedBy(m));
    }
    this.listChildren.set(Information.causesPrefix, this._causes)
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
      ListUpdater.removeFromList(this, rec.repeats)
    })
    this.isUsedOn.forEach((send: SendMessage) => {
      ListUpdater.removeFromList(this, send.uses)
    })

    ListUpdater.destructAllFromChangingList(this.targetedBy)
    while (this.targetedBy.length>0) {
      this.targetedBy[0].destruct()
    }

    super.destruct();
  }
}

export class NewInformation extends Information {
  private _source!: ReceiveMessage;

  override getTreeParent() {
    return this._source;
  }

  override getTiming(): number | undefined {
    return this._source?.timing
  }

  constructor(source: ReceiveMessage,
              message: string, isInstruction: boolean = false, position?: BoundingBox,
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              initialTrust?: number, currentTrust?: number, feltTrustImmediately?: number , feltTrustAfterwards?: number,
              ref?: Ref, deserializer?: Deserializer, jsonOpt?: NewInformationJson
  ) {
    let refC = Ref.createRef(EClasses.NewInformation, ref)
    super(refC, message, isInstruction, position, isUsedOn, repeatedBy, initialTrust, currentTrust, feltTrustImmediately, feltTrustAfterwards, deserializer, jsonOpt);
    if(deserializer) {
      let json: NewInformationJson = jsonOpt ? jsonOpt : deserializer.getJsonFromTree(ref!.$ref)
      //todo this works against a bug in the used json lib: it computes the necessary source if it is not present
      let src = json.source? json.source : new Ref(Ref.getParentAddress(ref!.$ref), EClasses.ReceiveMessage)
      this._source = deserializer.getOrCreate(src)
    } else {
      this.source = source
    }
  }

  override duplicate(): NewInformation {
    return new NewInformation(this._source, 'Copy of ' + this.message, this.isInstruction, this.position, [], [], this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  // does both directions (source and generates)
  set source(rec: ReceiveMessage) {
    if (this._source != rec) {
      ListUpdater.removeFromList(this, this._source?.generates)
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
    ListUpdater.removeFromList(this, this._source.generates)
    super.destruct();
  }
}

export class Preknowledge extends Information {

  constructor(message: string = 'Preknowledge', isInstruction: boolean = false, position?: BoundingBox,
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              initialTrust?: number, currentTrust?: number,
              feltTrustImmediately?: number, feltTrustAfterwards?: number,
              ref?: Ref, deserializer?: Deserializer, jsonOpt?: PreknowledgeJson) {
    let refC = Ref.createRef(EClasses.Preknowledge, ref)
    super(refC, message, isInstruction, position, isUsedOn, repeatedBy, initialTrust, currentTrust, feltTrustImmediately, feltTrustAfterwards, deserializer, jsonOpt);
  }

  getTiming(): number {
    let timing;
    if (this.isUsedOn?.length >0) {
      timing = Math.min(...this.isUsedOn.map(send => send.timing));
    } else {
      timing = 0
    }
    return timing
  }

  override duplicate(): Preknowledge {
    return new Preknowledge('Copy of ' + this.message, this.isInstruction, this.position, [], [], this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  override toJson(): PreknowledgeJson {
    return (<PreknowledgeJson>super.toJson())
  }
}

export class InformationLink extends Referencable {

  private _source?: Information;
  get source(): Information {
    return this._source!!; //todo
  }
  set source(source: Information) {
    let oldSource = this._source;
    if (oldSource != source){
      this._source = source;
      source.addCauses(this)
      oldSource?.removeCauses(this)
    }
  }

  override getTreeParent(): Information | undefined {
    return this._source;
  }

  private _target?: Information;
  get target(): Information {
    return this._target!!;
  }
  set target(target: Information) {
    let oldTarget = this._target;
    if (oldTarget != target){
      this._target = target;
      target.addTargetedBy(this);
      oldTarget?.removeTargetedBy(this);
    }
  }

  private _type: InformationLinkType = InformationLinkType.SUPPLEMENT;
  get type(): InformationLinkType {
    return this._type;
  }
  set type(type: InformationLinkType) {
    this._type = type;
  }

  private _linkText?: string;
  get linkText(): string | undefined {
    return this._linkText;
  }
  set linkText(linkText: string | undefined) {
    this._linkText = linkText;
  }

  constructor(source: Information, target: Information, type: InformationLinkType, linkText?: string,
              ref?: Ref, deserializer?: Deserializer, jsonOpt?: InformationLinkJson
  ) {
    let refC = Ref.createRef(EClasses.InformationLink, ref)
    super(refC);
    if(deserializer) {
      deserializer.put(this)
      let json: InformationLinkJson = jsonOpt ? jsonOpt : deserializer.getJsonFromTree(ref!.$ref)
      //todo there is a problem with the incoming json: it does not have the link soruces. However, we solve this via 'prepareJsonInfoLinkSources' called in the loadKEML() method on modelIoService
      let src = json.source!!
      this.source = deserializer.getOrCreate(src)
      this.target = deserializer.getOrCreate(json.target);
      this.type = json.type;
      let text;
      if (json.linkText && json.linkText.length > 0) {text = json.linkText} else {text = undefined}
      this.linkText = text;
    } else {
      this.source = source;
      this.target = target;
      this.type = type;
      this.linkText = linkText;
    }
  }

  toJson(): InformationLinkJson {
    return {
      eClass: EClasses.InformationLink,
      source: this.source.getRef(),
      target: this.target.getRef(),
      type: this.type,
      linkText: this.linkText,
    }
  }

  override destruct() {
    ListUpdater.removeFromList(this, this.source.causes)
    ListUpdater.removeFromList(this, this.target.targetedBy)
    super.destruct();
  }

}

