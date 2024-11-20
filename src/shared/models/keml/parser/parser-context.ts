import {Ref} from "./ref";
import {Referencable} from "./referenceable";
import {Conversation as ConversationJson, ConversationPartner as ConversationPartnerJson} from "../../sequence-diagram-models";
import {Author} from "../author";
import {ConversationPartner} from "../conversation-partner";
import {InformationLink, NewInformation, Preknowledge, ReceiveMessage, SendMessage} from "../msg-info";
import {InformationLinkType} from "../../knowledge-models";

/*
idea:
  1) store any element with complete xPath, on lookup during construction you trigger the creation if the object does not exist yet
  2) after returning from all triggered creations, finish your own job ;)
 */
export class ParserContext {

  conv: ConversationJson;

  constructorPointers: Map<string, (e:string) => Referencable > = new Map();

  context: Map<string, any> = new Map<string, any>();

  constructor(conv: ConversationJson) {
    this.conv = conv;

    //create function pointers (!arrow functions (!) to have parsercontext as this) for all existing types:
    const authorFun: (path :string) => Author =  (path:string) => {
      let ref = new Ref(path, Author.eClass)
      return new Author( undefined, 0, [], [], ref, this)
    }
    this.constructorPointers.set(Author.eClass, authorFun)

    const convPartnerFun: (path: string) => ConversationPartner = (path: string) => {
      let ref = new Ref(path, ConversationPartner.eClass)
      return new ConversationPartner(undefined, 0, ref, this)
    }
    this.constructorPointers.set(ConversationPartner.eClass, convPartnerFun)

    const preknowledgeFun: (path: string) => Preknowledge = (path: string) => {
      let ref = new Ref(path, Preknowledge.eClass)
      return new Preknowledge(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        ref, this)
    }
    this.constructorPointers.set(Preknowledge.eClass, preknowledgeFun)

    const newInfoFun: (path: string) => NewInformation = (path: string) => {
      let ref = new Ref(path, NewInformation.eClass)
      //todo not nice source
      let dummySource = new ReceiveMessage(new ConversationPartner(), 0)
      return new NewInformation(dummySource, '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ref, this)
    }
    this.constructorPointers.set(NewInformation.eClass, newInfoFun)

    const sendMessageFun: (path: string) => SendMessage = (path: string) => {
      let ref: Ref = new Ref(path, SendMessage.eClass)
      return new SendMessage(new ConversationPartner(), 0, undefined, undefined, undefined, ref, this)
    }
    this.constructorPointers.set(SendMessage.eClass, sendMessageFun)

    const receiveMessageFun: (path: string) => ReceiveMessage = (path: string) => {
      let ref: Ref = new Ref(path, ReceiveMessage.eClass)
      return new ReceiveMessage(new ConversationPartner(), 0, undefined, undefined, undefined, undefined, undefined, ref, this)
    }
    this.constructorPointers.set(ReceiveMessage.eClass, receiveMessageFun)

    const informationLinkFun: (path: string) => InformationLink = (path: string) => {
      let ref: Ref = new Ref(path, InformationLink.eClass)
      let dummyInfo = new Preknowledge()
      return new InformationLink(dummyInfo, dummyInfo, InformationLinkType.SUPPLEMENT, undefined, ref, this)
    }
    this.constructorPointers.set(InformationLink.eClass, informationLinkFun)
  }

  getJsonFromTree<T>(path: string): T {
    //first replace index access (.) by normal path divider, since they are all finally [] accesses
    const accessPaths = path.replaceAll('.', Ref.pathDivider).split(Ref.pathDivider)
      //path.split( new RegExp('(/@|\\.)'), -1)
    let res = (this.conv as any);
    for (let i = 1; i<accessPaths.length; i++) {
      res = res[(accessPaths[i])]
    }
    return (res as T);
  }

  getOrCreate<T extends Referencable>(ref: Ref): T {
    //get constructor from ref.eclass
    let res = this.get<T>(ref.$ref)
    if (res)
      return res
    else {
      //get from constructor pointer....
      let constrPointer: ((e: string) => Referencable) | undefined = this.constructorPointers.get(ref.eClass!)
      if (constrPointer) {
        let res = constrPointer(ref.$ref)
        return (res as T);
      } else {
        throw(`Constructor pointer for ${ref} not set.`);
      }
    }
  }

  get<T extends Referencable>(key: string): T {
    return (this.context.get(key) as T);
  }

  put<T extends Referencable>(elem: T ) {
    this.context.set(elem.getRef().$ref, elem);
  }

  putList<T extends Referencable>(formerPrefix: string, ownHeader: string, content: T[]) {
    const prefix = Ref.computePrefix(formerPrefix, ownHeader);
    content?.forEach((t: T, index) =>
      this.context.set(Ref.mixWithIndex(prefix, index), t)
    )
  }

  // for changing eClass assignment (i.e. on subtypes)
  static createRefList2(formerPrefix: string, ownHeader: string, eClasses: string[] = []): Ref[] {
    const prefix = Ref.computePrefix(formerPrefix, ownHeader);
    console.log(eClasses)
    return eClasses.map((eClass, index) => new Ref(Ref.mixWithIndex(prefix, index), eClass))
  }

  static createSingleRef(formerPrefix: string, ownHeader: string, eClass: string): Ref {
    const ref = Ref.computePrefix(formerPrefix, ownHeader)
    return new Ref(ref, eClass)
  }

}
