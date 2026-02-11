import {ConversationPartner} from "./conversation-partner";
import {
  InformationLinkType,
} from "@app/shared/keml/json/knowledge-models";
import {EClasses} from "@app/shared/keml/eclasses";
import {
  attribute,
  eClass,
  Referencable,
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
    timing: number = 0,
    content: string = "",
    originalContent?: string,
  ) {
    super();
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

@eClass(EClasses.SendMessage)
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
    timing?: number,
    content: string = 'New send content',
    originalContent?: string,
  ) {
    super(timing, content, originalContent);
    this._uses  = new ReLinkListContainer<Information>(this, SendMessage.$usesName, Information.$isUsedOnName);
  }

  static create(counterPart: ConversationPartner,
                timing: number,
                content: string = 'New send content',
                originalContent?: string,
  ): SendMessage {
    const send = new SendMessage(timing, content, originalContent);
    send.counterPart = counterPart;
    return send;
  }

}

@eClass(EClasses.ReceiveMessage)
export class ReceiveMessage extends Message {
  static readonly $generatesName: string = 'generates';
  static readonly $repeatsName: string = 'repeats';

  _generates: ReTreeListContainer<NewInformation>;
  get generates(): NewInformation[] {
    return this._generates.get()!!
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
    timing?: number,
    content: string = "New receive content",
    originalContent?: string,
    isInterrupted: boolean = false,
  ) {
    super(timing, content, originalContent);
    this._generates = new ReTreeListContainer<NewInformation>(this, ReceiveMessage.$generatesName, NewInformation.$sourceName, EClasses.NewInformation);
    this._repeats = new ReLinkListContainer<Information>(this, ReceiveMessage.$repeatsName, Information.$repeatedByName);
    this.isInterrupted = isInterrupted;
  }

  static create(counterPart: ConversationPartner,
                timing: number,
                content?: string,
                originalContent?: string,
                isInterrupted: boolean = false,): ReceiveMessage {
    const rec = new ReceiveMessage(timing, content, originalContent, isInterrupted);
    rec.counterPart = counterPart;
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

  readonly _targetedBy: ReLinkListContainer<InformationLink>
  get targetedBy(): InformationLink[] {
    return this._targetedBy.get();
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

  protected constructor() {
    super();

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

@eClass(EClasses.NewInformation)
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

  constructor() {
    super();
    this._source = new ReTreeParentContainer(this, NewInformation.$sourceName, ReceiveMessage.$generatesName);
  }

  override duplicate(): NewInformation {
    return NewInformation.create(this.source, 'Copy of ' + this.message, this.isInstruction, this.position, this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  static create(source: ReceiveMessage,
                message: string, isInstruction: boolean = false, position?: BoundingBox,
                initialTrust?: number, currentTrust?: number, feltTrustImmediately?: number, feltTrustAfterwards?: number,): NewInformation {
    const info = new NewInformation();
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

@eClass(EClasses.Preknowledge)
export class Preknowledge extends Information {

  constructor() {
    super();
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

  static create(message: string = 'Preknowledge', isInstruction: boolean = false, position?: BoundingBox,
                initialTrust?: number, currentTrust?: number,
                feltTrustImmediately?: number, feltTrustAfterwards?: number): Preknowledge {
    const pre = new Preknowledge()
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

@eClass(EClasses.InformationLink)
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

  constructor() {
    super();
    this._source = new ReTreeParentContainer<Information>(this, InformationLink.$sourceName, NewInformation.$causesName);
    this._target = new ReLinkSingleContainer<Information>(this, InformationLink.$targetName, Information.$targetedByName);
  }

  static create(source: Information, target: Information, type: InformationLinkType, linkText?: string,): InformationLink {
    const link = new InformationLink()
    link.source = source
    link.target = target;
    link.type = type
    link.linkText = linkText
    return link
  }

}

