import {ConversationPartner} from "./conversation-partner";
import {MessageJson, ReceiveMessageJson, SendMessageJson,} from "@app/shared/keml/json/sequence-diagram-models";
import {
  InformationJson,
  InformationLinkJson,
  InformationLinkType,
  NewInformationJson,
  PreknowledgeJson,
} from "@app/shared/keml/json/knowledge-models";
import {EClasses} from "@app/shared/keml/eclasses";
import {Deserializer, Ref, Referencable, ListUpdater, ReferencableListContainer, ReferencableSingletonContainer, ReferencableTreeListContainer} from "emfular";
import {BoundingBox, Positionable, PositionHelper} from "ngx-svg-graphics";
import {RefHandler} from "emfular";


export abstract class Message extends Referencable {
  public static readonly counterPartPrefix = 'counterPart'

  _counterPart: ReferencableSingletonContainer<ConversationPartner> = new ReferencableSingletonContainer<ConversationPartner>(this, Message.counterPartPrefix)
  get counterPart(): ConversationPartner {
    return this._counterPart.get()!! //todo
  }
  set counterPart(value: ConversationPartner) {
    this._counterPart.add(value);
  }

  timing: number = 0;
  content: string;
  originalContent?: string;

  protected constructor(
    ref: Ref,
    counterPart: ConversationPartner,
    timing: number,
    content: string,
    originalContent?: string,
    deserializer?: Deserializer,
    jsonOpt?: MessageJson,
  ) {
    super(ref);
    if(deserializer) {
      deserializer.put(this)
      let json: MessageJson = jsonOpt? jsonOpt: deserializer.getJsonFromTree(ref!.$ref);
      this._counterPart.add(deserializer.getOrCreate(json.counterPart))
      this.timing = json.timing? json.timing : 0;
      this.content = json.content;
      this.originalContent = json.originalContent;
    } else {
      this._counterPart.add(counterPart);
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

  static createTreeBackbone(ref: Ref, context: Deserializer): Message {
    if (ref.eClass == EClasses.SendMessage) {
      return SendMessage.createTreeBackbone(ref, context);
    } else {
      return ReceiveMessage.createTreeBackbone(ref, context);
    }
  }

}

export class SendMessage extends Message {
  public static readonly usesPrefix = 'uses'

  private _uses: ReferencableListContainer<Information> = new ReferencableListContainer<Information>(this, SendMessage.usesPrefix, Information.isUsedOnPrefix)
  get uses(): Information[] {
    return this._uses.get();
  }
  addUsage(info: Information) {
    this._uses.add(info)
  }
  removeUsage(info: Information) {
    this._uses.remove(info)
  }

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content: string = 'New send content',
    originalContent?: string,
    uses: Information[] = [],
    ref?: Ref,
    deserializer?: Deserializer,
    jsonOpt?: SendMessageJson,
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.SendMessage, ref)
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
      info.removeIsUsedOn(this)
    })
    super.destruct()
  }

  static override createTreeBackbone(ref: Ref, context: Deserializer): SendMessage {
    let sendJson: SendMessageJson = context.getJsonFromTree(ref.$ref)
    //todo make dummy unnecessary?
    let dummyCp = new ConversationPartner()
    let send = new SendMessage(dummyCp, sendJson.timing, sendJson.content, sendJson.originalContent, [], ref)
    context.put(send)
    return send
  }

}

export class ReceiveMessage extends Message {
  static readonly generatesPrefix: string = 'generates';
  static readonly repeatsPrefix: string = 'repeats';

  generates: NewInformation[] = [];


  _repeats: ReferencableListContainer<Information> = new ReferencableListContainer<Information>(this, ReceiveMessage.repeatsPrefix, Information.repeatedByPrefix);
  get repeats(): Information[] {
    return this._repeats.get();
  }
  addRepetition(info: Information) {
    if(!Information.isRepetitionAllowed(this, info)) {
      throw new RangeError("Repetition is only allowed to an earlier information")
    }
    this._repeats.add(info);
  }
  removeRepetition(info: Information) {
    this._repeats.remove(info);
  }

  isInterrupted: boolean = false;

  constructor(
    counterPart: ConversationPartner,
    timing: number,
    content?: string,
    originalContent?: string,
    repeats: Information[] = [],
    isInterrupted: boolean = false,
    ref?: Ref,
    deserializer?: Deserializer,
    jsonOpt?: ReceiveMessageJson,
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.ReceiveMessage, ref)
    super(refC, counterPart, timing, content ? content : "New receive content", originalContent, deserializer, jsonOpt);
    if (deserializer) {
      let json: ReceiveMessageJson = jsonOpt ? jsonOpt : deserializer.getJsonFromTree(ref!.$ref)
      //todo remove???
      let generatesRefs = Deserializer.createRefList(ref!.$ref, ReceiveMessage.generatesPrefix, json.generates?.map(g => g.eClass? g.eClass: EClasses.NewInformation))
      this.generates = generatesRefs.map(g => deserializer.getOrCreate(g))
      json.repeats?.map(r => this.addRepetition(deserializer.getOrCreate<NewInformation>(r)))
      this.isInterrupted = json.isInterrupted;
    } else {
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
      this._repeats.remove(info)
    })
    super.destruct()
  }

  static override createTreeBackbone(ref: Ref, context: Deserializer): ReceiveMessage {
    let recJson: ReceiveMessageJson = context.getJsonFromTree(ref.$ref)
    let dummyCp = new ConversationPartner()
    let rec = new ReceiveMessage(dummyCp, recJson.timing, recJson.content, recJson.originalContent, [], recJson.isInterrupted, ref)
    context.put(rec)
    //todo children recJson.generates.map()
    return rec
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

  static readonly causesPrefix: string = 'causes'
  static readonly isUsedOnPrefix: string = 'isUsedOn'
  static readonly repeatedByPrefix: string = 'repeatedBy'
  static readonly targetedByPrefix: string = 'targetedBy'
  private _causes: ReferencableTreeListContainer<InformationLink> = new ReferencableTreeListContainer<InformationLink>(this, NewInformation.causesPrefix, InformationLink.sourcePrefix);
  get causes(): InformationLink[] {
    return this._causes.get();
  }
  addCauses(...link: InformationLink[]) {
    link?.map(l => this._causes.add(l))
  }
  removeCauses(link: InformationLink) {
    this._causes.remove(link)
  }

  private _targetedBy: ReferencableListContainer<InformationLink> = new ReferencableListContainer<InformationLink>(this, Information.targetedByPrefix, InformationLink.targetPrefix)
  get targetedBy(): InformationLink[] {
    return this._targetedBy.get();
  }
  addTargetedBy(link: InformationLink) {
    this._targetedBy.add(link)
  }
  removeTargetedBy(link: InformationLink) {
    this._targetedBy.remove(link)
  }

  private _isUsedOn: ReferencableListContainer<SendMessage> = new ReferencableListContainer<SendMessage>(this, 'isUsedOn', 'uses');
  get isUsedOn(): SendMessage[] {
    return this._isUsedOn.get();
  }
  addIsUsedOn(send: SendMessage){
    this._isUsedOn.add(send)
  }
  removeIsUsedOn(send: SendMessage){
    this._isUsedOn.remove(send)
  }

  private _repeatedBy: ReferencableListContainer<ReceiveMessage> = new ReferencableListContainer(this, NewInformation.repeatedByPrefix, ReceiveMessage.repeatsPrefix);
  get repeatedBy(): ReceiveMessage[] {
    return this._repeatedBy.get();
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
    this._repeatedBy.add(msg)
  }
  removeRepeatedBy(msg: ReceiveMessage) {
    this._repeatedBy.remove(msg)
  }

  protected constructor(
    ref: Ref,
    message: string, isInstruction: boolean = false, position?: BoundingBox,
    isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
    initialTrust?: number, currentTrust?: number, feltTrustImmediately?: number, feltTrustAfterwards?: number,
    deserializer?: Deserializer, jsonOpt?: InformationJson
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
      causesRefs.map(r => this.addCauses( deserializer.getOrCreate<InformationLink>(r)))
      json.targetedBy?.map(r =>  this.addTargetedBy(deserializer.getOrCreate(r)))
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
      rec.removeRepetition(this)
    })
    this.isUsedOn.forEach((send: SendMessage) => {
      send.removeUsage(this)
    })

    ListUpdater.destructAllFromChangingList(this.targetedBy)

    super.destruct();
  }
}

export class NewInformation extends Information {
  private _source!: ReceiveMessage;
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
    let refC = RefHandler.createRefIfMissing(EClasses.NewInformation, ref)
    super(refC, message, isInstruction, position, isUsedOn, repeatedBy, initialTrust, currentTrust, feltTrustImmediately, feltTrustAfterwards, deserializer, jsonOpt);
    if(deserializer) {
      let json: NewInformationJson = jsonOpt ? jsonOpt : deserializer.getJsonFromTree(ref!.$ref)
      //todo this works against a bug in the used json lib: it computes the necessary source if it is not present
      let src = json.source? json.source : RefHandler.createRef(RefHandler.getParentAddress(ref!.$ref), EClasses.ReceiveMessage)
      this._source = deserializer.getOrCreate(src)
    } else {
      this.source = source
    }
  }

  override duplicate(): NewInformation {
    return new NewInformation(this._source, 'Copy of ' + this.message, this.isInstruction, this.position, [], [], this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
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

  static createTreeBackbone(ref: Ref, context: Deserializer): NewInformation {
    let newInfoJson: NewInformationJson = context.getJsonFromTree(ref.$ref)
    // todo source is the tree parent so it already exists...
    let srcRefRef = RefHandler.getParentAddress(ref.$ref)
    let srcRef = RefHandler.createRef(srcRefRef, EClasses.ReceiveMessage)
    let src: ReceiveMessage = context.getOrCreate(srcRef) // only get
    let newInfo = new NewInformation(src,
        newInfoJson.message, newInfoJson.isInstruction,
        newInfoJson.position, [], [],
        newInfoJson.initialTrust, newInfoJson.currentTrust, newInfoJson.feltTrustImmediately, newInfoJson.feltTrustAfterwards,
        ref);
    context.put(newInfo)
    // todo children: links
    return newInfo
  }
}

export class Preknowledge extends Information {

  constructor(message: string = 'Preknowledge', isInstruction: boolean = false, position?: BoundingBox,
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              initialTrust?: number, currentTrust?: number,
              feltTrustImmediately?: number, feltTrustAfterwards?: number,
              ref?: Ref, deserializer?: Deserializer, jsonOpt?: PreknowledgeJson) {
    let refC = RefHandler.createRefIfMissing(EClasses.Preknowledge, ref)
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

  public static readonly sourcePrefix = 'source'
  public static readonly targetPrefix = 'target'
  private _source: ReferencableSingletonContainer<Information> = new ReferencableSingletonContainer<Information>(this, InformationLink.sourcePrefix, NewInformation.causesPrefix);
  get source(): Information {
    return this._source.get()!!; //todo
  }
  set source(source: Information) {
    this._source.add(source)
  }

  override getTreeParent(): Information | undefined {
    return this.source;
  }

  private _target: ReferencableSingletonContainer<Information> = new ReferencableSingletonContainer<Information>(this, InformationLink.targetPrefix, Information.targetedByPrefix);
  get target(): Information {
    return this._target.get()!!;
  }
  set target(target: Information) {
    this._target.add(target);
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
    let refC = RefHandler.createRefIfMissing(EClasses.InformationLink, ref)
    super(refC);
    if(deserializer) {
      deserializer.put(this)
      let json: InformationLinkJson = jsonOpt ? jsonOpt : deserializer.getJsonFromTree(ref!.$ref)
      //todo there is a problem with the incoming json: it does not have the link soruces. However, we solve this via 'prepareJsonInfoLinkSources' called in the loadKEML() method on modelIoService
      let src = json.source!!
      this.source = deserializer.getOrCreate(src)
      this.target = deserializer.getOrCreate(json.target);
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

