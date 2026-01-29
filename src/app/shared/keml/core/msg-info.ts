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

  timing: number = 0;
  content: string;
  originalContent?: string;

  protected constructor(
    ref: Ref,
    timing?: number,
    content?: string,
    originalContent?: string,
  ) {
    super(ref);
    if(timing) this.timing = timing;
    this.content = content? content: "";
    this.originalContent = originalContent;
  }

  static isSend(eClass: string) {
    return eClass.endsWith("SendMessage");
  }

  isSend(): boolean {
    return Message.isSend(this.ref.eClass);
  }

  override toJson(): MessageJson {
    return {
      content: this.content,
      counterPart: this._counterPart.toJson()!!,
      eClass: this.ref.eClass,
      originalContent: this.originalContent,
      timing: this.timing
    }
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
    timing?: number,
    content: string = 'New send content',
    originalContent?: string,
    ref?: Ref,
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.SendMessage, ref)
    super(refC, timing? timing:0, content, originalContent);
    this._uses  = new ReLinkListContainer<Information>(this, SendMessage.$usesName, Information.$isUsedOnName);
  }

  override toJson(): SendMessageJson {
    let res = (<SendMessageJson>super.toJson());
    res.uses = this.uses.map(u => u.getRef())
    return res;
  }

  static create(counterPart: ConversationPartner,
                timing: number,
                content: string = 'New send content',
                originalContent?: string,
                ref?: Ref,
                ): SendMessage {
    const send = new SendMessage(timing, content, originalContent, ref);
    send.counterPart = counterPart;
    return send;
  }

  static fromJson(json: SendMessageJson, ref: Ref): SendMessage {
    return new SendMessage(
      json.timing, json.content, json.originalContent,
      ref
    )
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

  isInterrupted: boolean = false;

  constructor(
    timing: number,
    content?: string,
    originalContent?: string,
    isInterrupted: boolean = false,
    ref?: Ref,
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.ReceiveMessage, ref)
    super(refC, timing, content ? content : "New receive content", originalContent);
    this._generates = new ReTreeListContainer<NewInformation>(this, ReceiveMessage.$generatesName, NewInformation.$sourceName, EClasses.NewInformation);
    this._repeats = new ReLinkListContainer<Information>(this, ReceiveMessage.$repeatsName, Information.$repeatedByName);
    this.isInterrupted = isInterrupted;
  }

  override toJson(): ReceiveMessageJson {
    let res = (<ReceiveMessageJson>super.toJson());
    res.generates = this._generates.toJson()
    res.repeats = this._repeats.toJson()
    res.isInterrupted = this.isInterrupted
    return res;
  }

  static create(counterPart: ConversationPartner,
                timing: number,
                content?: string,
                originalContent?: string,
                isInterrupted: boolean = false,
                ref?: Ref,): ReceiveMessage {
    const rec = new ReceiveMessage(timing, content, originalContent, isInterrupted, ref);
    rec.counterPart = counterPart;
    return rec
  }

  static fromJson(json: ReceiveMessageJson, ref: Ref): ReceiveMessage {
    //todo
    return new ReceiveMessage(json.timing, json.content, json.originalContent, false, ref)
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
  addIsUsedOn(send: SendMessage){
    this._isUsedOn.add(send)
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

  protected constructor(
    ref: Ref,
    message: string, isInstruction: boolean = false, position?: BoundingBox,
    isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
    initialTrust?: number, currentTrust?: number, feltTrustImmediately?: number, feltTrustAfterwards?: number,
  ) {
    super(ref);

    this._causes = new ReTreeListContainer<InformationLink>(this, NewInformation.$causesName, InformationLink.$sourceName, EClasses.InformationLink);
    this._targetedBy = new ReLinkListContainer<InformationLink>(this, Information.$targetedByName, InformationLink.$targetName)
    this._isUsedOn = new ReLinkListContainer<SendMessage>(this, 'isUsedOn', 'uses');
    this._repeatedBy = new ReLinkListContainer(this, NewInformation.$repeatedByName, ReceiveMessage.$repeatsName);
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

  override toJson(): InformationJson {
    return {
      causes: this._causes.toJson(),
      currentTrust: this.currentTrust,
      eClass: this.ref.eClass,
      initialTrust: this.initialTrust,
      feltTrustImmediately: this.feltTrustImmediately,
      feltTrustAfterwards: this.feltTrustAfterwards,
      isInstruction: this.isInstruction,
      isUsedOn: this._isUsedOn.toJson(),
      message: this.message,
      repeatedBy:  this._repeatedBy.toJson(),
      targetedBy:  this._targetedBy.toJson(),
      position: this.position,
    }
  }

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

  constructor(source: ReceiveMessage,
              message: string, isInstruction: boolean = false, position?: BoundingBox,
              isUsedOn: SendMessage[] = [], repeatedBy: ReceiveMessage[] = [],
              initialTrust?: number, currentTrust?: number, feltTrustImmediately?: number , feltTrustAfterwards?: number,
              ref?: Ref,
  ) {
    let refC = RefHandler.createRefIfMissing(EClasses.NewInformation, ref)
    super(refC, message, isInstruction, position, isUsedOn, repeatedBy, initialTrust, currentTrust, feltTrustImmediately, feltTrustAfterwards);
    this._source = new ReTreeParentContainer(this, NewInformation.$sourceName, ReceiveMessage.$generatesName);
    this.source = source
  }

  override duplicate(): NewInformation {
    return new NewInformation(this.source, 'Copy of ' + this.message, this.isInstruction, this.position, [], [], this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  override toJson(): NewInformationJson {
    let res = (<NewInformationJson>super.toJson());
    res.source = this._source.toJson()
    return res;
  }

  static fromJson( json: NewInformationJson, ref: Ref): NewInformation {
    //todo
    let dummyRec = new ReceiveMessage(0)

    return new NewInformation(dummyRec, json.message, json.isInstruction, json.position, [], [], json.initialTrust, json.currentTrust, json.feltTrustImmediately, json.feltTrustAfterwards, ref)
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

  static fromJson( json: PreknowledgeJson, ref: Ref): Preknowledge {
    return new Preknowledge(json.message, json.isInstruction, json.position,
      [], [],
      json.initialTrust, json.currentTrust, json.feltTrustImmediately, json.feltTrustAfterwards,
      ref
    )
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
    this._source = new ReTreeParentContainer<Information>(this, InformationLink.$sourceName, NewInformation.$causesName);
    this._target = new ReLinkSingleContainer<Information>(this, InformationLink.$targetName, Information.$targetedByName);

    this.source = source;
    this.target = target;
    this.type = type;
    this.linkText = linkText;
  }

  override toJson(): InformationLinkJson {
    return {
      eClass: EClasses.InformationLink,
      source: this._source.toJson(),
      target: this._target.toJson()!!,
      type: this.type,
      linkText: this.linkText,
    }
  }

  static fromJson( json: InformationLinkJson, ref: Ref): InformationLink {
    //todo
    let dummySrc = new Preknowledge()
    let dummyTar = new Preknowledge()
    return new InformationLink(dummySrc, dummyTar, json.type, json.linkText, ref)
  }

}

