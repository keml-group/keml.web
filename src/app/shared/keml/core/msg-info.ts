import {ConversationPartner} from "./conversation-partner";
import { ReceiveMessageJson, SendMessageJson,} from "@app/shared/keml/json/sequence-diagram-models";
import {
  InformationLinkJson,
  InformationLinkType,
  NewInformationJson,
  PreknowledgeJson,
} from "@app/shared/keml/json/knowledge-models";
import {EClasses} from "@app/shared/keml/eclasses";
import {
  attribute,
  Ref,
  Referencable,
  RefHandler,
  ReLinkListContainer,
  ReLinkSingleContainer,
  ReTreeListContainer,
  ReTreeParentContainer
} from "emfular";

import {BoundingBox, Positionable, PositionHelper} from "ngx-svg-graphics";


export abstract class Message extends Referencable {
  public static readonly $counterPartName = 'counterPart'

  _counterPart: ReLinkSingleContainer<ConversationPartner> = new ReLinkSingleContainer<ConversationPartner>(this, Message.$counterPartName)
  get counterPart(): ConversationPartner {
    return this._counterPart.get()!! //todo
  }
  set counterPart(value: ConversationPartner) {
    this._counterPart.add(value);
  }

  @attribute()
  timing: number;
  @attribute()
  content: string;
  @attribute()
  originalContent?: string;

  protected constructor(
    ref: Ref,
    timing: number=0,
    content: string="",
    originalContent?: string,
  ) {
    super(ref);
    this.timing = timing;
    this.content = content;
    this.originalContent = originalContent;
  }

  static isSend(eClass: string) {
    return eClass.endsWith("SendMessage");
  }

  isSend(): this is SendMessage {
    return this instanceof SendMessage
  }

  isReceive(): this is ReceiveMessage {
    return this instanceof ReceiveMessage
  }

  static newMessage(isSend: boolean, counterPart: ConversationPartner, timing: number, content: string, originalContent: string = 'Original content'): Message {
    if (isSend) {
      return SendMessage.create(counterPart, timing, content, originalContent)
    } else {
      return ReceiveMessage.create(counterPart, timing, content, originalContent)
    }
  }
}

export class SendMessage extends Message {
  public static readonly $usesName = 'uses'

  private readonly _uses: ReLinkListContainer<Information>;
  get uses(): Information[] {
    return this._uses.get();
  }
  addUsage(info: Information) {
    this._uses.add(info)
  }
  removeUsage(info: Information): boolean {
    return this._uses.remove(info)
  }

  constructor(
    ref?: Ref,
    timing?: number,
    content: string = 'New send content',
    originalContent?: string,
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.SendMessage, ref)
    super(refC, timing, content, originalContent);
    this._uses  = new ReLinkListContainer<Information>(this, SendMessage.$usesName, Information.$isUsedOnName);
  }

  static create(counterPart: ConversationPartner,
                timing: number,
                content: string = 'New send content',
                originalContent?: string,
                ref?: Ref,
                ): SendMessage {
    const send = new SendMessage(ref, timing, content, originalContent);
    send.counterPart = counterPart;
    return send;
  }

  static fromJson(json: SendMessageJson, ref: Ref): SendMessage {
    const send = new SendMessage(ref)
    send.fill(json)
    return send;
  }

}

export class ReceiveMessage extends Message {
  static readonly $generatesName: string = 'generates';
  static readonly $repeatsName: string = 'repeats';

  _generates: ReTreeListContainer<NewInformation>;
  get generates(): NewInformation[] {
    return this._generates.get()!!
  }
  addGenerates(news: NewInformation) {
    this._generates.add(news)
  }

  _repeats: ReLinkListContainer<Information>;
  get repeats(): Information[] {
    return this._repeats.get();
  }
  addRepetition(info: Information) {
    this._repeats.add(info);
  }
  removeRepetition(info: Information): boolean {
    return this._repeats.remove(info);
  }

  @attribute()
  isInterrupted: boolean = false;

  constructor(
    ref?: Ref,
    timing?: number,
    content: string = "New receive content",
    originalContent?: string,
    isInterrupted: boolean = false,
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.ReceiveMessage, ref)
    super(refC, timing, content, originalContent);
    this._generates = new ReTreeListContainer<NewInformation>(this, ReceiveMessage.$generatesName, NewInformation.$sourceName, EClasses.NewInformation);
    this._repeats = new ReLinkListContainer<Information>(this, ReceiveMessage.$repeatsName, Information.$repeatedByName);
    this.isInterrupted = isInterrupted;
  }

  static create(counterPart: ConversationPartner,
                timing: number,
                content?: string,
                originalContent?: string,
                isInterrupted: boolean = false,
                ref?: Ref,): ReceiveMessage {
    const rec = new ReceiveMessage(ref, timing, content, originalContent, isInterrupted);
    rec.counterPart = counterPart;
    return rec
  }

  static fromJson(json: ReceiveMessageJson, ref: Ref): ReceiveMessage {
    const rec = new ReceiveMessage(ref)
    rec.fill(json)
    return rec
  }

}


export abstract class Information extends Referencable implements Positionable {

  @attribute()
  message: string = "";
  @attribute()
  isInstruction: boolean = false;
  @attribute()
  position: BoundingBox = Information.createBB();
  @attribute()
  initialTrust: number | undefined;
  @attribute()
  currentTrust: number | undefined;
  @attribute()
  feltTrustImmediately: number | undefined;
  @attribute()
  feltTrustAfterwards: number | undefined;

  abstract getTiming(): number;

  static readonly $causesName: string = 'causes'
  static readonly $isUsedOnName: string = 'isUsedOn'
  static readonly $repeatedByName: string = 'repeatedBy'
  static readonly $targetedByName: string = 'targetedBy'
  readonly _causes: ReTreeListContainer<InformationLink>;
  get causes(): InformationLink[] {
    return this._causes.get();
  }
  addCauses(...link: InformationLink[]) {
    link?.map(l => this._causes.add(l))
  }
  removeCauses(link: InformationLink) {
    this._causes.remove(link)
  }

  readonly _targetedBy: ReLinkListContainer<InformationLink>
  get targetedBy(): InformationLink[] {
    return this._targetedBy.get();
  }
  addTargetedBy(link: InformationLink) {
    this._targetedBy.add(link)
  }
  removeTargetedBy(link: InformationLink) {
    this._targetedBy.remove(link)
  }

  readonly _isUsedOn: ReLinkListContainer<SendMessage>
  get isUsedOn(): SendMessage[] {
    return this._isUsedOn.get();
  }
  addIsUsedOn(...send: SendMessage[]){
    send.map(s => this._isUsedOn.add(s))
  }
  removeIsUsedOn(send: SendMessage){
    this._isUsedOn.remove(send)
  }

  readonly _repeatedBy: ReLinkListContainer<ReceiveMessage>
  get repeatedBy(): ReceiveMessage[] {
    return this._repeatedBy.get();
  }

  addRepeatedBy(msg: ReceiveMessage) {
    this._repeatedBy.add(msg)
  }
  removeRepeatedBy(msg: ReceiveMessage) {
    this._repeatedBy.remove(msg)
  }

  protected constructor(ref: Ref) {
    super(ref);

    this._causes = new ReTreeListContainer<InformationLink>(this, NewInformation.$causesName, InformationLink.$sourceName, EClasses.InformationLink);
    this._targetedBy = new ReLinkListContainer<InformationLink>(this, Information.$targetedByName, InformationLink.$targetName)
    this._isUsedOn = new ReLinkListContainer<SendMessage>(this, 'isUsedOn', 'uses');
    this._repeatedBy = new ReLinkListContainer(this, NewInformation.$repeatedByName, ReceiveMessage.$repeatsName);
  }

  static createBB(bb?: BoundingBox): BoundingBox {
    return bb? bb : PositionHelper.newBoundingBox()
  }

  abstract duplicate(): Information;

  override destruct() {
    this._targetedBy.delete() //necessary to have a link die on target death
    super.destruct();
  }
}

export class NewInformation extends Information {

  public static readonly $sourceName = 'source'

  readonly _source: ReTreeParentContainer<ReceiveMessage>;
  set source(rec: ReceiveMessage) {
    this._source.add(rec)
  }
  get source(): ReceiveMessage {
    return this._source.get()!!
  }

  override getTiming(): number {
    return this.source.timing
  }

  constructor(ref?: Ref) {
    let refC = RefHandler.createRefIfMissing(EClasses.NewInformation, ref)
    super(refC);
    this._source = new ReTreeParentContainer(this, NewInformation.$sourceName, ReceiveMessage.$generatesName);
  }

  override duplicate(): NewInformation {
    return NewInformation.create(this.source, 'Copy of ' + this.message, this.isInstruction, this.position, this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  static fromJson( json: NewInformationJson, ref: Ref): NewInformation {
    const newInfo = new NewInformation(ref)
    newInfo.fill(json)
    return newInfo
  }

  static create(source: ReceiveMessage,
         message: string, isInstruction: boolean = false, position?: BoundingBox,
         initialTrust?: number, currentTrust?: number, feltTrustImmediately?: number , feltTrustAfterwards?: number,
         ref?: Ref,): NewInformation {
    const info = new NewInformation(ref);
    info.source = source;
    info.message = message;
    info.isInstruction = isInstruction;
    info.position = Information.createBB(position);
    info.initialTrust = initialTrust;
    info.currentTrust = currentTrust;
    info.feltTrustImmediately = feltTrustImmediately;
    info.feltTrustAfterwards = feltTrustAfterwards;
    return info;
  }

}

export class Preknowledge extends Information {

  constructor(ref?: Ref) {
    let refC = RefHandler.createRefIfMissing(EClasses.Preknowledge, ref)
    super(refC);
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
    return Preknowledge.create('Copy of ' + this.message, this.isInstruction, this.position, this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  static fromJson( json: PreknowledgeJson, ref: Ref): Preknowledge {
    const pre = new Preknowledge(ref)
    pre.fill(json)
    return pre
  }

  static create(message: string = 'Preknowledge', isInstruction: boolean = false, position?: BoundingBox,
                initialTrust?: number, currentTrust?: number,
                feltTrustImmediately?: number, feltTrustAfterwards?: number,
                ref?: Ref): Preknowledge {
    const pre = new Preknowledge(ref)
    pre.message = message
    pre.isInstruction = isInstruction
    pre.position = Information.createBB(position)
    pre.initialTrust = initialTrust
    pre.currentTrust = currentTrust
    pre.feltTrustImmediately = feltTrustImmediately
    pre.feltTrustAfterwards = feltTrustAfterwards
    return pre
  }

}

export class InformationLink extends Referencable {

  public static readonly $sourceName = 'source'
  public static readonly $targetName = 'target'
  readonly _source: ReTreeParentContainer<Information>
  get source(): Information {
    return this._source.get()!!; //todo
  }
  set source(source: Information) {
    this._source.add(source)
  }

  readonly _target: ReLinkSingleContainer<Information>
  get target(): Information {
    return this._target.get()!!;
  }
  set target(target: Information) {
    this._target.add(target);
  }

  @attribute()
  type: InformationLinkType = InformationLinkType.SUPPLEMENT;
  @attribute()
  linkText?: string;

  constructor(ref?: Ref) {
    let refC = RefHandler.createRefIfMissing(EClasses.InformationLink, ref)
    super(refC);
    this._source = new ReTreeParentContainer<Information>(this, InformationLink.$sourceName, NewInformation.$causesName);
    this._target = new ReLinkSingleContainer<Information>(this, InformationLink.$targetName, Information.$targetedByName);
  }

  static create(source: Information, target: Information, type: InformationLinkType, linkText?: string,
                ref?: Ref,): InformationLink {
    const link = new InformationLink(ref)
    link.source = source
    link.target = target;
    link.type = type
    link.linkText = linkText
    return link
  }

  static fromJson( json: InformationLinkJson, ref: Ref): InformationLink {
    let res = new InformationLink( ref)
    res.fill(json)
    return res
  }

}

