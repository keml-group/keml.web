import { ConversationPartner } from "./conversation-partner";
import { InformationLinkType } from "@app/shared/keml/json/knowledge-models";
import { attribute, eClass, reference, ModelList, Referencable } from "emfular";
import { BoundingBox, Positionable, PositionHelper } from "ngx-svg-graphics";
import { Author } from "@app/shared/keml/core/author";
import { KemlMeta,
  MessageRefs,
  SendMessageRefs,
  ReceiveMessageRefs,
  InformationRefs,
  NewInformationRefs,
  InformationLinkRefs
} from "@app/shared/keml/keml-meta";


// -----------------------------------------------------
// Message (abstract)
// -----------------------------------------------------
@eClass(KemlMeta)
export abstract class Message extends Referencable<Author> {

  @reference(MessageRefs.counterPart)
  declare counterPart: ConversationPartner;

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
    return this instanceof SendMessage;
  }

  isReceive(): this is ReceiveMessage {
    return this instanceof ReceiveMessage;
  }

  static newMessage(
    isSend: boolean,
    counterPart: ConversationPartner,
    timing: number,
    content: string,
    originalContent: string = "Original content"
  ): Message {
    if (isSend) {
      return SendMessage.create(counterPart, timing, content, originalContent);
    } else {
      return ReceiveMessage.create(counterPart, timing, content, originalContent);
    }
  }
}


// -----------------------------------------------------
// SendMessage
// -----------------------------------------------------

@eClass(KemlMeta)
export class SendMessage extends Message {

  @reference(SendMessageRefs.uses)
  declare uses: ModelList<Information>;

  constructor(
    timing?: number,
    content: string = "New send content",
    originalContent?: string,
  ) {
    super(timing, content, originalContent);
  }

  addUsage(info: Information) {
    this.uses.push(info);
  }

  removeUsage(info: Information): boolean {
    return this.uses.remove(info);
  }

  static create(
    counterPart: ConversationPartner,
    timing: number,
    content: string = "New send content",
    originalContent?: string,
  ): SendMessage {
    const send = new SendMessage(timing, content, originalContent);
    send.counterPart = counterPart;
    return send;
  }
}


// -----------------------------------------------------
// ReceiveMessage
// -----------------------------------------------------

@eClass(KemlMeta)
export class ReceiveMessage extends Message {

  @reference(ReceiveMessageRefs.generates)
  declare generates: ModelList<NewInformation>;

  @reference(ReceiveMessageRefs.repeats)
  declare repeats: ModelList<Information>;

  @attribute()
  isInterrupted: boolean = false;

  constructor(
    timing?: number,
    content: string = "New receive content",
    originalContent?: string,
    isInterrupted: boolean = false,
  ) {
    super(timing, content, originalContent);
    this.isInterrupted = isInterrupted;
  }

  addRepetition(info: Information) {
    this.repeats.push(info);
  }

  removeRepetition(info: Information): boolean {
    return this.repeats.remove(info);
  }

  static create(
    counterPart: ConversationPartner,
    timing: number,
    content?: string,
    originalContent?: string,
    isInterrupted: boolean = false,
  ): ReceiveMessage {
    const rec = new ReceiveMessage(timing, content, originalContent, isInterrupted);
    rec.counterPart = counterPart;
    return rec;
  }
}


// -----------------------------------------------------
// Information (abstract)
// -----------------------------------------------------
@eClass(KemlMeta)
export abstract class Information<P extends Referencable<any> = Referencable<any>>
  extends Referencable<P>
  implements Positionable {

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

  @reference(InformationRefs.causes)
  declare causes: ModelList<InformationLink>;

  @reference(InformationRefs.targetedBy)
  declare targetedBy: ModelList<InformationLink>;

  @reference(InformationRefs.isUsedOn)
  declare isUsedOn: ModelList<SendMessage>;

  @reference(InformationRefs.repeatedBy)
  declare repeatedBy: ModelList<ReceiveMessage>;

  addIsUsedOn(...send: SendMessage[]) {
    send.map(s => this.isUsedOn.push(s));
  }

  removeIsUsedOn(send: SendMessage) {
    return this.isUsedOn.remove(send);
  }

  addRepeatedBy(msg: ReceiveMessage) {
    this.repeatedBy.push(msg);
  }

  removeRepeatedBy(msg: ReceiveMessage) {
    return this.repeatedBy.remove(msg);
  }

  protected constructor() {
    super();
  }

  static createBB(bb?: BoundingBox): BoundingBox {
    return bb ? bb : PositionHelper.newBoundingBox();
  }

  abstract getTiming(): number;

  abstract duplicate(): Information;

  override destruct() {
    this.targetedBy.delete();
    super.destruct();
  }
}


// -----------------------------------------------------
// NewInformation
// -----------------------------------------------------

@eClass(KemlMeta)
export class NewInformation extends Information<ReceiveMessage> {

  @reference(NewInformationRefs.source)
  declare source: ReceiveMessage;

  override getTiming(): number {
    return this.source.timing;
  }

  constructor() {
    super();
  }

  override duplicate(): NewInformation {
    return NewInformation.create(
      this.source,
      "Copy of " + this.message,
      this.isInstruction,
      this.position,
      this.initialTrust,
      this.currentTrust,
      this.feltTrustImmediately,
      this.feltTrustAfterwards
    );
  }

  static create(
    source: ReceiveMessage,
    message: string,
    isInstruction: boolean = false,
    position?: BoundingBox,
    initialTrust?: number,
    currentTrust?: number,
    feltTrustImmediately?: number,
    feltTrustAfterwards?: number,
  ): NewInformation {
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


// -----------------------------------------------------
// Preknowledge
// -----------------------------------------------------

@eClass(KemlMeta)
export class Preknowledge extends Information<Author> {

  constructor() {
    super();
  }

  getTiming(): number {
    let timing;
    if (this.isUsedOn?.length > 0) {
      timing = Math.min(...this.isUsedOn.map(send => send.timing));
    } else {
      timing = 0;
    }
    return timing;
  }

  override duplicate(): Preknowledge {
    return Preknowledge.create(
      "Copy of " + this.message,
      this.isInstruction,
      this.position,
      this.initialTrust,
      this.currentTrust,
      this.feltTrustImmediately,
      this.feltTrustAfterwards
    );
  }

  static create(
    message: string = "Preknowledge",
    isInstruction: boolean = false,
    position?: BoundingBox,
    initialTrust?: number,
    currentTrust?: number,
    feltTrustImmediately?: number,
    feltTrustAfterwards?: number
  ): Preknowledge {
    const pre = new Preknowledge();
    pre.message = message;
    pre.isInstruction = isInstruction;
    pre.position = Information.createBB(position);
    pre.initialTrust = initialTrust;
    pre.currentTrust = currentTrust;
    pre.feltTrustImmediately = feltTrustImmediately;
    pre.feltTrustAfterwards = feltTrustAfterwards;
    return pre;
  }
}


// -----------------------------------------------------
// InformationLink
// -----------------------------------------------------

@eClass(KemlMeta)
export class InformationLink extends Referencable<Information> {

  @reference(InformationLinkRefs.source)
  declare source: Information;

  @reference(InformationLinkRefs.target)
  declare target: Information;

  @attribute()
  type: InformationLinkType = InformationLinkType.SUPPLEMENT;

  @attribute()
  linkText?: string;

  constructor() {
    super();
  }

  static create(
    source: Information,
    target: Information,
    type: InformationLinkType,
    linkText?: string,
  ): InformationLink {
    const link = new InformationLink();
    link.source = source;
    link.target = target;
    link.type = type;
    link.linkText = linkText;
    return link;
  }
}
