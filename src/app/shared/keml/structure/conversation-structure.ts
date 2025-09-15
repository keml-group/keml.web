export class StructuralElement {
  static #instance: StructuralElement;
  static singleChildren: Map<string, StructuralElement> = new Map();
  listChildren: Map<string, StructuralElement> = new Map();


  static get instance(): StructuralElement {
    if (!StructuralElement.instance) {
      StructuralElement.#instance = new StructuralElement();
    }
    return StructuralElement.instance;
  }
}

export class InformationLinkStructure extends StructuralElement {}

export class InformationStructure extends StructuralElement {
  constructor() {
    super();
    this.listChildren.set('causes', InformationLinkStructure.instance)
  }
}

export class PreknowledgeStructure extends InformationStructure {}

export class NewInformationStructure extends InformationStructure {}

export class MessageStructure extends StructuralElement {}

export class ReceiveMessageStructure extends MessageStructure {
  constructor() {
    super();
    this.listChildren.set('generates', NewInformationStructure.instance)
  }
}

export class SendMessageStructure extends MessageStructure {}

export class AuthorStructure extends StructuralElement {
  constructor() {
    super();
    this.listChildren.set('messages', new MessageStructure())
  }
}

export class ConversationPartnerStructure extends StructuralElement {

}

export class ConversationStructure extends StructuralElement {
  constructor() {
    super();
    ConversationStructure.singleChildren.set('author', new AuthorStructure())
    this.listChildren.set('conversationPartners', new ConversationPartnerStructure());
  }
}



