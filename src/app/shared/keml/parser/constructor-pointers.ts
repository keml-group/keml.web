import  {Ref} from "@app/core/emfular/refs/ref"
import {Referencable} from "@app/core/emfular/refs/referenceable";
import {Author} from "@app/shared/keml/models/core/author";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {InformationLink, NewInformation, Preknowledge, ReceiveMessage, SendMessage} from "@app/shared/keml/models/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";
import {Parser} from "@app/shared/keml/parser/parser";


export class ConstructorPointers {

  constructorPointers: Map<string, (e:string) => (p: Parser) => Referencable >;

  constructor() {
    this.constructorPointers = new Map();

    //create function pointers (!arrow functions (!) to have parsercontext as this) for all existing types:
    const authorFun: (path :string) => ( ( parser: Parser ) => Author ) = (path:string) => (parser: Parser) => {
      let ref = new Ref(path, Author.eClass)
      return new Author( undefined, 0, [], [], ref, parser)
    }
    this.constructorPointers.set(Author.eClass, authorFun)

    const convPartnerFun: (path: string) => ( parser: Parser ) => ConversationPartner = (path: string) => ( parser: Parser ) => {
      let ref = new Ref(path, ConversationPartner.eClass)
      return new ConversationPartner(undefined, 0, ref, parser)
    }
    this.constructorPointers.set(ConversationPartner.eClass, convPartnerFun)

    const preknowledgeFun: (path: string) => ( parser: Parser ) => Preknowledge = (path: string) => ( parser: Parser ) => {
      let ref = new Ref(path, Preknowledge.eClass)
      return new Preknowledge(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        ref, parser)
    }
    this.constructorPointers.set(Preknowledge.eClass, preknowledgeFun)

    const newInfoFun: (path: string) => ( parser: Parser ) => NewInformation = (path: string) => ( parser: Parser ) => {
      let ref = new Ref(path, NewInformation.eClass)
      //todo not nice source
      let dummySource = new ReceiveMessage(new ConversationPartner(), 0)
      return new NewInformation(dummySource, '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ref, parser)
    }
    this.constructorPointers.set(NewInformation.eClass, newInfoFun)

    const sendMessageFun: (path: string) => ( parser: Parser ) => SendMessage = (path: string) => ( parser: Parser ) => {
      let ref: Ref = new Ref(path, SendMessage.eClass)
      return new SendMessage(new ConversationPartner(), 0, undefined, undefined, undefined, ref, parser)
    }
    this.constructorPointers.set(SendMessage.eClass, sendMessageFun)

    const receiveMessageFun: (path: string) => ( parser: Parser ) => ReceiveMessage = (path: string) => ( parser: Parser ) => {
      let ref: Ref = new Ref(path, ReceiveMessage.eClass)
      return new ReceiveMessage(new ConversationPartner(), 0, undefined, undefined, undefined, undefined, undefined, ref, parser)
    }
    this.constructorPointers.set(ReceiveMessage.eClass, receiveMessageFun)

    const informationLinkFun: (path: string) => ( parser: Parser ) => InformationLink = (path: string) => ( parser: Parser ) => {
      let ref: Ref = new Ref(path, InformationLink.eClass)
      let dummyInfo = new Preknowledge()
      return new InformationLink(dummyInfo, dummyInfo, InformationLinkType.SUPPLEMENT, undefined, ref, parser)
    }
    this.constructorPointers.set(InformationLink.eClass, informationLinkFun)
  }

  get<T extends Referencable>(ref: Ref, parser: Parser): T {
    let constrPointer: ((e: string) => ( parser: Parser ) => Referencable) | undefined = this.constructorPointers.get(ref.eClass)
    if (constrPointer) {
      let res = constrPointer(ref.$ref)
      let withParse = res(parser)
      return (withParse as T);
    } else {
      throw(`Constructor pointer for ${ref} not set.`);
    }
  }
}
