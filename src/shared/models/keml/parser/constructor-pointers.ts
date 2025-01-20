import  {Ref} from "../../parser/ref"
import {Referencable} from "../../parser/referenceable";
import {Author} from "../author";
import {ConversationPartner} from "../conversation-partner";
import {InformationLink, NewInformation, Preknowledge, ReceiveMessage, SendMessage} from "../msg-info";
import {InformationLinkType} from "../json/knowledge-models";
import {Parser} from "../../parser/parser";


export class ConstructorPointers {

  constructorPointers: Map<string, (e:string) => Referencable >;

  constructor( parser: Parser) {
    this.constructorPointers = new Map();

    //create function pointers (!arrow functions (!) to have parsercontext as this) for all existing types:
    const authorFun: (path :string) => Author =  (path:string) => {
      let ref = new Ref(path, Author.eClass)
      return new Author( undefined, 0, [], [], ref, parser)
    }
    this.constructorPointers.set(Author.eClass, authorFun)

    const convPartnerFun: (path: string) => ConversationPartner = (path: string) => {
      let ref = new Ref(path, ConversationPartner.eClass)
      return new ConversationPartner(undefined, 0, ref, parser)
    }
    this.constructorPointers.set(ConversationPartner.eClass, convPartnerFun)

    const preknowledgeFun: (path: string) => Preknowledge = (path: string) => {
      let ref = new Ref(path, Preknowledge.eClass)
      return new Preknowledge(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        ref, parser)
    }
    this.constructorPointers.set(Preknowledge.eClass, preknowledgeFun)

    const newInfoFun: (path: string) => NewInformation = (path: string) => {
      let ref = new Ref(path, NewInformation.eClass)
      //todo not nice source
      let dummySource = new ReceiveMessage(new ConversationPartner(), 0)
      return new NewInformation(dummySource, '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ref, parser)
    }
    this.constructorPointers.set(NewInformation.eClass, newInfoFun)

    const sendMessageFun: (path: string) => SendMessage = (path: string) => {
      let ref: Ref = new Ref(path, SendMessage.eClass)
      return new SendMessage(new ConversationPartner(), 0, undefined, undefined, undefined, ref, parser)
    }
    this.constructorPointers.set(SendMessage.eClass, sendMessageFun)

    const receiveMessageFun: (path: string) => ReceiveMessage = (path: string) => {
      let ref: Ref = new Ref(path, ReceiveMessage.eClass)
      return new ReceiveMessage(new ConversationPartner(), 0, undefined, undefined, undefined, undefined, undefined, ref, parser)
    }
    this.constructorPointers.set(ReceiveMessage.eClass, receiveMessageFun)

    const informationLinkFun: (path: string) => InformationLink = (path: string) => {
      let ref: Ref = new Ref(path, InformationLink.eClass)
      let dummyInfo = new Preknowledge()
      return new InformationLink(dummyInfo, dummyInfo, InformationLinkType.SUPPLEMENT, undefined, ref, parser)
    }
    this.constructorPointers.set(InformationLink.eClass, informationLinkFun)
  }

  get<T extends Referencable>(ref: Ref): T {
    let constrPointer: ((e: string) => Referencable) | undefined = this.constructorPointers.get(ref.eClass!)
    if (constrPointer) {
      let res = constrPointer(ref.$ref)
      return (res as T);
    } else {
      throw(`Constructor pointer for ${ref} not set.`);
    }
  }
}
