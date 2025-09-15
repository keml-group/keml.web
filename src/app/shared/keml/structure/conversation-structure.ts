import {ReferenceStructure} from "@app/shared/keml/structure/reference-structure";

export class StructuralElement {
  static #instance: StructuralElement;
  static readonly treeChildren: ReferenceStructure[] = [];
  static readonly otherRelations: ReferenceStructure[] = [];

  static get instance(): StructuralElement {
    if (!StructuralElement.instance) {
      StructuralElement.#instance = new StructuralElement();
    }
    return StructuralElement.instance;
  }
}

export class ConversationStructure extends StructuralElement {
  static readonly authorPrefix = 'author';
  static readonly author: ReferenceStructure = new ReferenceStructure(ConversationStructure.authorPrefix, false);
  static readonly conversationPartnersPrefix = 'conversationPartners';
  static readonly conversationPartners: ReferenceStructure = new ReferenceStructure(ConversationStructure.conversationPartnersPrefix, true)


  constructor() {
    super();
    ConversationStructure.treeChildren.push(
      ConversationStructure.author,
      ConversationStructure.conversationPartners
    )
  }
}

export class ConversationPartnerStructure extends StructuralElement {}

export class AuthorStructure extends StructuralElement {

  static readonly preknowledgePrefix: string = 'preknowledge';
  static preknowledge: ReferenceStructure = new ReferenceStructure(AuthorStructure.preknowledgePrefix, true);
  static readonly messagesPrefix: string = 'messages';
  static messages: ReferenceStructure = new ReferenceStructure(AuthorStructure.messagesPrefix, true);

  constructor() {
    super();
    AuthorStructure.treeChildren.push(
      AuthorStructure.preknowledge,
      AuthorStructure.messages
    )
  }
}

export class MessageStructure extends StructuralElement {
  static readonly counterPartPrefix: string = 'counterPart';
  static counterpart: ReferenceStructure = new ReferenceStructure(MessageStructure.counterPartPrefix, false);

}

export class ReceiveMessageStructure extends MessageStructure {
  static readonly generatesPrefix: string = 'generates';
  static generates: ReferenceStructure = new ReferenceStructure(ReceiveMessageStructure.generatesPrefix, true);

  constructor() {
    super();
    ReceiveMessageStructure.generates.inverse = NewInformationStructure.source
    ReceiveMessageStructure.treeChildren.push(ReceiveMessageStructure.generates)
  }
}

export class SendMessageStructure extends MessageStructure {}

export class InformationStructure extends StructuralElement {
  static readonly causesPrefix = 'causes';
  static readonly causes = new ReferenceStructure(InformationStructure.causesPrefix, true) // todo add inverse?


  constructor() {
    super();
    InformationStructure.causes.inverse = InformationLinkStructure.source
    InformationStructure.treeChildren.push(InformationStructure.causes)
  }
}

export class PreknowledgeStructure extends InformationStructure {}

export class NewInformationStructure extends InformationStructure {
  static readonly sourcePrefix = 'source';
  static source: ReferenceStructure = new ReferenceStructure(NewInformationStructure.sourcePrefix, false)

  constructor() {
    super();
    NewInformationStructure.source.inverse = ReceiveMessageStructure.generates
  }
}

export class InformationLinkStructure extends StructuralElement {
  static readonly sourcePrefix = 'source';
  static readonly source = new ReferenceStructure(
    InformationLinkStructure.sourcePrefix,
    false,
    InformationStructure.causes
  )

  constructor() {
    super();
    InformationLinkStructure.otherRelations.push(InformationLinkStructure.source);
  }
}

