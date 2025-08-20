import {
  Deserializer,
  Ref,
  ConstructorPointers,
  ConstructorPointerFor
} from "emfular";
import {Author} from "@app/shared/keml/core/author";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {
  InformationLink,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "@app/shared/keml/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";
import {EClasses} from "@app/shared/keml/eclasses";


export class KEMLConstructorPointers {

  static getConstructorPointers(): ConstructorPointers {
    let constructorPointers = new Map();

    //create function pointers (!arrow functions (!) to have deserializercontext as this) for all existing types:
    const authorFun: ConstructorPointerFor<Author> = ($ref:string) => (deserializer: Deserializer) => {
      let ref = new Ref($ref, EClasses.Author)
      return new Author( undefined, 0, [], [], ref, deserializer)
    }
    constructorPointers.set(EClasses.Author, authorFun)

    const convPartnerFun:ConstructorPointerFor<ConversationPartner> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref = new Ref($ref, EClasses.ConversationPartner)
      return new ConversationPartner(undefined, 0, ref, deserializer)
    }
    constructorPointers.set(EClasses.ConversationPartner, convPartnerFun)

    const preknowledgeFun: ConstructorPointerFor<Preknowledge> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref = new Ref($ref, EClasses.Preknowledge)
      return new Preknowledge(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        ref, deserializer)
    }
    constructorPointers.set(EClasses.Preknowledge, preknowledgeFun)

    const newInfoFun: ConstructorPointerFor<NewInformation> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref = new Ref($ref, EClasses.NewInformation)
      //todo not nice source
      let dummySource = new ReceiveMessage(new ConversationPartner(), 0)
      return new NewInformation(dummySource, '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ref, deserializer)
    }
    constructorPointers.set(EClasses.NewInformation, newInfoFun)

    const sendMessageFun: ConstructorPointerFor<SendMessage> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref: Ref = new Ref($ref, EClasses.SendMessage)
      return new SendMessage(new ConversationPartner(), 0, undefined, undefined, undefined, ref, deserializer)
    }
    constructorPointers.set(EClasses.SendMessage, sendMessageFun)

    const receiveMessageFun: ConstructorPointerFor<ReceiveMessage> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref: Ref = new Ref($ref, EClasses.ReceiveMessage)
      return new ReceiveMessage(new ConversationPartner(), 0, undefined, undefined, undefined, undefined, undefined, ref, deserializer)
    }
    constructorPointers.set(EClasses.ReceiveMessage, receiveMessageFun)

    const informationLinkFun: ConstructorPointerFor<InformationLink> = ($ref: string) => (deserializer: Deserializer ) => {
      let ref: Ref = new Ref($ref, EClasses.InformationLink)
      let dummyInfo = new Preknowledge()
      return new InformationLink(dummyInfo, dummyInfo, InformationLinkType.SUPPLEMENT, undefined, ref, deserializer)
    }
    constructorPointers.set(EClasses.InformationLink, informationLinkFun)

    return constructorPointers
  }
}
