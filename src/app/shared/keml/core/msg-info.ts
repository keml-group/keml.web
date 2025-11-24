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
import {
  Deserializer,
  Ref,
  Referencable,
  RefHandler,
  ReferencableListContainer,
  ReferencableSingletonContainer,
  ReferencableTreeListContainer,
  ReferencableTreeParentContainer
} from "emfular";

import {BoundingBox, Positionable, PositionHelper} from "ngx-svg-graphics";


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
  ) {
    super(ref);
    this._counterPart.add(counterPart);
    this.timing = timing;
    this.content = content;
    this.originalContent = originalContent;

    this.$otherReferences.push(this._counterPart) //todo this is tree backwards - suppress?
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

  private _uses: ReferencableListContainer<Information>;
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
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.SendMessage, ref)
    super(refC, counterPart, timing, content, originalContent);
    this._uses  = new ReferencableListContainer<Information>(this, SendMessage.usesPrefix, Information.isUsedOnPrefix);
    this.$otherReferences.push(this._uses);
    uses.map(u => this.addUsage(u))
  }

  override toJson(): SendMessageJson {
    let res = (<SendMessageJson>super.toJson());
    res.uses = this.uses.map(u => u.getRef())
    return res;
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


  _generates: ReferencableTreeListContainer<NewInformation>;
  get generates(): NewInformation[] {
    return this._generates.get()!!
  }
  addGenerates(news: NewInformation) {
    this._generates.add(news)
  }


  _repeats: ReferencableListContainer<Information>;
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
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.ReceiveMessage, ref)
    super(refC, counterPart, timing, content ? content : "New receive content", originalContent);
    this._generates = new ReferencableTreeListContainer<NewInformation>(this, ReceiveMessage.generatesPrefix, NewInformation.sourcePrefix);
    this._repeats = new ReferencableListContainer<Information>(this, ReceiveMessage.repeatsPrefix, Information.repeatedByPrefix);
    this.$treeChildren.push(this._generates)
    this.$otherReferences.push(this._repeats)
    repeats.map(r => this.addRepetition(r));
    this.isInterrupted = isInterrupted;
  }

  override toJson(): ReceiveMessageJson {
    let res = (<ReceiveMessageJson>super.toJson());
    res.generates = this.generates.map(g => g.toJson())
    res.repeats = this.repeats.map(r => r.getRef())
    res.isInterrupted = this.isInterrupted
    return res;
  }

  static override createTreeBackbone(ref: Ref, context: Deserializer): ReceiveMessage {
    let recJson: ReceiveMessageJson = context.getJsonFromTree(ref.$ref)
    let dummyCp = new ConversationPartner()
    let rec = new ReceiveMessage(dummyCp, recJson.timing, recJson.content, recJson.originalContent, [], recJson.isInterrupted, ref)
    context.put(rec)
    let generatesRefs = Deserializer.createRefList(
      ref!.$ref,
      ReceiveMessage.generatesPrefix,
      recJson.generates?.map(_ => EClasses.NewInformation))
    generatesRefs.map(newRef =>
      rec.addGenerates(NewInformation.createTreeBackbone(newRef, context))
    )
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
  private _causes: ReferencableTreeListContainer<InformationLink>;
  get causes(): InformationLink[] {
    return this._causes.get();
  }
  addCauses(...link: InformationLink[]) {
    link?.map(l => this._causes.add(l))
  }
  removeCauses(link: InformationLink) {
    this._causes.remove(link)
  }

  private _targetedBy: ReferencableListContainer<InformationLink>
  get targetedBy(): InformationLink[] {
    return this._targetedBy.get();
  }
  addTargetedBy(link: InformationLink) {
    this._targetedBy.add(link)
  }
  removeTargetedBy(link: InformationLink) {
    this._targetedBy.remove(link)
  }

  private _isUsedOn: ReferencableListContainer<SendMessage>
  get isUsedOn(): SendMessage[] {
    return this._isUsedOn.get();
  }
  addIsUsedOn(send: SendMessage){
    this._isUsedOn.add(send)
  }
  removeIsUsedOn(send: SendMessage){
    this._isUsedOn.remove(send)
  }

  private _repeatedBy: ReferencableListContainer<ReceiveMessage>
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
  ) {
    super(ref);

    this._causes = new ReferencableTreeListContainer<InformationLink>(this, NewInformation.causesPrefix, InformationLink.sourcePrefix);
    this._targetedBy = new ReferencableListContainer<InformationLink>(this, Information.targetedByPrefix, InformationLink.targetPrefix)
    this._isUsedOn = new ReferencableListContainer<SendMessage>(this, 'isUsedOn', 'uses');
    this._repeatedBy = new ReferencableListContainer(this, NewInformation.repeatedByPrefix, ReceiveMessage.repeatsPrefix);
    this.$treeChildren.push(this._causes)
    this.$otherReferences.push(this._targetedBy, this._isUsedOn, this._repeatedBy)

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
      isUsedOn: this.isUsedOn.map(m => m.getRef()),
      message: this.message,
      repeatedBy:  this.repeatedBy.map(m => m.getRef()),
      targetedBy:  this.targetedBy.map(l => l.getRef()),
      position: this.position,
    }
  }

  override destruct() {
    this._targetedBy.delete() //necessary to have a link die on target death
    super.destruct();
  }
}

export class NewInformation extends Information {

  public static readonly sourcePrefix = 'source'

  private _source: ReferencableTreeParentContainer<ReceiveMessage>;
  set source(rec: ReceiveMessage) {
    this._source.add(rec)
  }
  get source(): ReceiveMessage {
    return this._source.get()!!
  }

  override getTreeParent() {
    return this.source;
  }

  override getTiming(): number | undefined {
    return this.source.timing
  }

  constructor(source: ReceiveMessage,
              message: string, isInstruction: boolean = false, position?: BoundingBox,
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              initialTrust?: number, currentTrust?: number, feltTrustImmediately?: number , feltTrustAfterwards?: number,
              ref?: Ref,
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.NewInformation, ref)
    super(refC, message, isInstruction, position, isUsedOn, repeatedBy, initialTrust, currentTrust, feltTrustImmediately, feltTrustAfterwards);
    this._source = new ReferencableTreeParentContainer(this, NewInformation.sourcePrefix, ReceiveMessage.generatesPrefix);
    this.$otherReferences.push(this._source) //todo tree backwards
    this.source = source
  }

  override duplicate(): NewInformation {
    return new NewInformation(this.source, 'Copy of ' + this.message, this.isInstruction, this.position, [], [], this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  override toJson(): NewInformationJson {
    let res = (<NewInformationJson>super.toJson());
    res.source = this.source.getRef()
    return res;
  }

  static createTreeBackbone(ref: Ref, context: Deserializer): NewInformation {
    let newInfoJson: NewInformationJson = context.getJsonFromTree(ref.$ref)
    // todo source is the tree parent so it already exists...
    let srcRefRef = RefHandler.getParentAddress(ref.$ref)
    let srcRef = RefHandler.createRef(srcRefRef, EClasses.ReceiveMessage)
    let src: ReceiveMessage = context.get(srcRef.$ref)
    let newInfo = new NewInformation(src,
        newInfoJson.message, newInfoJson.isInstruction,
        newInfoJson.position, [], [],
        newInfoJson.initialTrust, newInfoJson.currentTrust, newInfoJson.feltTrustImmediately, newInfoJson.feltTrustAfterwards,
        ref);
    context.put(newInfo)
    newInfoJson.causes?.map((_, i) => {
      let newRefRef = RefHandler.mixWithPrefixAndIndex(ref.$ref, NewInformation.causesPrefix, i)
      let newRef = RefHandler.createRef(newRefRef, EClasses.InformationLink)
      let link = InformationLink.createTreeBackbone(newRef, context)
      newInfo.addCauses(link)
    })
    return newInfo
  }
}

export class Preknowledge extends Information {

  constructor(message: string = 'Preknowledge', isInstruction: boolean = false, position?: BoundingBox,
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              initialTrust?: number, currentTrust?: number,
              feltTrustImmediately?: number, feltTrustAfterwards?: number,
              ref?: Ref
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.Preknowledge, ref)
    super(refC, message, isInstruction, position, isUsedOn, repeatedBy, initialTrust, currentTrust, feltTrustImmediately, feltTrustAfterwards);
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

  static createTreeBackbone(ref: Ref, context: Deserializer): Preknowledge {
    let preJson: PreknowledgeJson = context.getJsonFromTree(ref.$ref)
    let pre = new Preknowledge(preJson.message, preJson.isInstruction, preJson.position,
        [], [],
        preJson.initialTrust, preJson.currentTrust, preJson.feltTrustImmediately, preJson.feltTrustAfterwards,
        ref)
    context.put(pre)
    preJson.causes?.map((_, i) => {
      let newRefRef = RefHandler.mixWithPrefixAndIndex(ref.$ref, Preknowledge.causesPrefix, i)
      let newRef = RefHandler.createRef(newRefRef, EClasses.InformationLink)
      let link = InformationLink.createTreeBackbone(newRef, context)
      pre.addCauses(link)
    })
    return pre;
  }
}

export class InformationLink extends Referencable {

  public static readonly sourcePrefix = 'source'
  public static readonly targetPrefix = 'target'
  private _source: ReferencableSingletonContainer<Information>
  get source(): Information {
    return this._source.get()!!; //todo
  }
  set source(source: Information) {
    this._source.add(source)
  }

  override getTreeParent(): Information | undefined {
    return this.source;
  }

  private _target: ReferencableSingletonContainer<Information>
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
              ref?: Ref,
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.InformationLink, ref)
    super(refC);
    this._source = new ReferencableSingletonContainer<Information>(this, InformationLink.sourcePrefix, NewInformation.causesPrefix);
    this._target = new ReferencableSingletonContainer<Information>(this, InformationLink.targetPrefix, Information.targetedByPrefix);
    this.$otherReferences.push(this._source, this._target)

    this.source = source;
    this.target = target;
    this.type = type;
    this.linkText = linkText;
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

  static createTreeBackbone(ref: Ref, context: Deserializer): InformationLink {
    let infoLinkJson: InformationLinkJson = context.getJsonFromTree(ref.$ref)
    let srcRef = RefHandler.createRef(RefHandler.getParentAddress(ref.$ref), infoLinkJson.source.eClass)
    let src: Information = context.get(srcRef.$ref)
    let dummyTarget = new Preknowledge()
    let infoLink: InformationLink = new InformationLink(src, dummyTarget, infoLinkJson.type, infoLinkJson.linkText, ref)
    context.put(infoLink)
    return infoLink
  }
}

