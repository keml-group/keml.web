import {
  Deserializer,
  Ref,
  ConstructorPointers,
  ConstructorPointerFor
} from "emfular";
import {Author} from "@app/shared/keml/models/core/author";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {
  InformationLink,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "@app/shared/keml/models/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";


export class KEMLConstructorPointers {

  static getConstructorPointers(): ConstructorPointers {
    let constructorPointers = new Map();

    //create function pointers (!arrow functions (!) to have deserializercontext as this) for all existing types:
    const authorFun: ConstructorPointerFor<Author> = ($ref:string) => (deserializer: Deserializer) => {
      let ref = new Ref($ref, Author.eClass)
      return new Author( undefined, 0, [], [], ref, deserializer)
    }
    constructorPointers.set(Author.eClass, authorFun)

    const convPartnerFun:ConstructorPointerFor<ConversationPartner> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref = new Ref($ref, ConversationPartner.eClass)
      return new ConversationPartner(undefined, 0, ref, deserializer)
    }
    constructorPointers.set(ConversationPartner.eClass, convPartnerFun)

    const preknowledgeFun: ConstructorPointerFor<Preknowledge> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref = new Ref($ref, Preknowledge.eClass)
      return new Preknowledge(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        ref, deserializer)
    }
    constructorPointers.set(Preknowledge.eClass, preknowledgeFun)

    const newInfoFun: ConstructorPointerFor<NewInformation> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref = new Ref($ref, NewInformation.eClass)
      //todo not nice source
      let dummySource = new ReceiveMessage(new ConversationPartner(), 0)
      return new NewInformation(dummySource, '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ref, deserializer)
    }
    constructorPointers.set(NewInformation.eClass, newInfoFun)

    const sendMessageFun: ConstructorPointerFor<SendMessage> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref: Ref = new Ref($ref, SendMessage.eClass)
      return new SendMessage(new ConversationPartner(), 0, undefined, undefined, undefined, ref, deserializer)
    }
    constructorPointers.set(SendMessage.eClass, sendMessageFun)

    const receiveMessageFun: ConstructorPointerFor<ReceiveMessage> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref: Ref = new Ref($ref, ReceiveMessage.eClass)
      return new ReceiveMessage(new ConversationPartner(), 0, undefined, undefined, undefined, undefined, undefined, ref, deserializer)
    }
    constructorPointers.set(ReceiveMessage.eClass, receiveMessageFun)

    const informationLinkFun: ConstructorPointerFor<InformationLink> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref: Ref = new Ref($ref, InformationLink.eClass)
      let dummyInfo = new Preknowledge()
      return new InformationLink(dummyInfo, dummyInfo, InformationLinkType.SUPPLEMENT, undefined, ref, deserializer)
    }
    constructorPointers.set(InformationLink.eClass, informationLinkFun)

    return constructorPointers
  }
}
