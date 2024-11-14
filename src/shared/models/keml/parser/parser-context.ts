import {Ref} from "./ref";
import {Referencable} from "./referenceable";
import {Conversation as ConversationJson, ConversationPartner as ConversationPartnerJson} from "../../sequence-diagram-models";
import {Author} from "../author";
import {Author as AuthorJson} from '../../sequence-diagram-models'
import {ConversationPartner} from "../conversation-partner";

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

    //create function pointers for all existing types:
    const authorFun: (_ :string) => Author = function (_:string) {
      let authorJson: AuthorJson = conv.author
      return new Author( undefined, 0, [], [], authorJson,)
    }
    this.constructorPointers.set('http://www.unikoblenz.de/keml#//Author', authorFun)

    const convPartnerFun: (path: string) => ConversationPartner = function (path: string) {
      let cpJson: ConversationPartnerJson = ParserContext.getJsonFromTree(path, conv)
      return new ConversationPartner(undefined, 0, cpJson)
    }
    this.constructorPointers.set('http://www.unikoblenz.de/keml#//ConversationPartner', convPartnerFun)
  }

  static getJsonFromTree(path: string, conv: ConversationJson): any { //actually a Json type

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

  createReferenceList<T extends Referencable>(formerPrefix: string, ownHeader: string, content: T[]) {

  }

}
