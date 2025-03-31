import {Parser} from "@app/shared/keml/parser/parser";
import {Author} from "@app/shared/keml/models/core/author";
import {Ref} from "@app/core/emfular/refs/ref";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {
  InformationLink,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "@app/shared/keml/models/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";
import {ConstructorPointers, ConstructorPointerTyped} from "@app/core/emfular/parser/constructor-pointers";


export class KEMLConstructorPointers {

  static getConstructorPointers(): ConstructorPointers {
    let constructorPointers = new Map();

    //create function pointers (!arrow functions (!) to have parsercontext as this) for all existing types:
    const authorFun: ConstructorPointerTyped<Author> = ($ref:string) => (parser: Parser) => {
      let ref = new Ref($ref, Author.eClass)
      return new Author( undefined, 0, [], [], ref, parser)
    }
    constructorPointers.set(Author.eClass, authorFun)

    const convPartnerFun:ConstructorPointerTyped<ConversationPartner> = ($ref: string) => ( parser: Parser ) => {
      let ref = new Ref($ref, ConversationPartner.eClass)
      return new ConversationPartner(undefined, 0, ref, parser)
    }
    constructorPointers.set(ConversationPartner.eClass, convPartnerFun)

    const preknowledgeFun: ConstructorPointerTyped<Preknowledge> = ($ref: string) => ( parser: Parser ) => {
      let ref = new Ref($ref, Preknowledge.eClass)
      return new Preknowledge(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        ref, parser)
    }
    constructorPointers.set(Preknowledge.eClass, preknowledgeFun)

    const newInfoFun: ConstructorPointerTyped<NewInformation> = ($ref: string) => ( parser: Parser ) => {
      let ref = new Ref($ref, NewInformation.eClass)
      //todo not nice source
      let dummySource = new ReceiveMessage(new ConversationPartner(), 0)
      return new NewInformation(dummySource, '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ref, parser)
    }
    constructorPointers.set(NewInformation.eClass, newInfoFun)

    const sendMessageFun: ConstructorPointerTyped<SendMessage> = ($ref: string) => ( parser: Parser ) => {
      let ref: Ref = new Ref($ref, SendMessage.eClass)
      return new SendMessage(new ConversationPartner(), 0, undefined, undefined, undefined, ref, parser)
    }
    constructorPointers.set(SendMessage.eClass, sendMessageFun)

    const receiveMessageFun: ConstructorPointerTyped<ReceiveMessage> = ($ref: string) => ( parser: Parser ) => {
      let ref: Ref = new Ref($ref, ReceiveMessage.eClass)
      return new ReceiveMessage(new ConversationPartner(), 0, undefined, undefined, undefined, undefined, undefined, ref, parser)
    }
    constructorPointers.set(ReceiveMessage.eClass, receiveMessageFun)

    const informationLinkFun: ConstructorPointerTyped<InformationLink> = ($ref: string) => ( parser: Parser ) => {
      let ref: Ref = new Ref($ref, InformationLink.eClass)
      let dummyInfo = new Preknowledge()
      return new InformationLink(dummyInfo, dummyInfo, InformationLinkType.SUPPLEMENT, undefined, ref, parser)
    }
    constructorPointers.set(InformationLink.eClass, informationLinkFun)

    return constructorPointers
  }
}
