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

    //create function pointers (!arrow functions (!) to have parsercontext as this) for all existing types:
    const authorFun: (_ :string) => Author =  (_:string) => {
      let authorJson: AuthorJson = conv.author
      return new Author( undefined, 0, [], [], authorJson, this)
    }
    this.constructorPointers.set(Author.eClass, authorFun)

    const convPartnerFun: (path: string) => ConversationPartner = (path: string) => {
      let cpJson: ConversationPartnerJson = this.getJsonFromTree(path)
      return new ConversationPartner(undefined, 0, cpJson, this)
    }
    this.constructorPointers.set(ConversationPartner.eClass, convPartnerFun)
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
    console.log('Called with '+ref);
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

  static createRefList(formerPrefix: string, ownHeader: string, eClass: string, contentLength: number,): Ref[] {
    const prefix = Ref.computePrefix(formerPrefix, ownHeader);
    return new Array(contentLength, 0).map((_, index) => new Ref(Ref.mixWithIndex(prefix, index), eClass))
  }

  static createSingleRef(formerPrefix: string, ownHeader: string, eClass: string): Ref {
    const ref = Ref.computePrefix(formerPrefix, ownHeader)
    return new Ref(ref, eClass)
  }

}
