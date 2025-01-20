import {Ref} from "./ref";
import {Referencable} from "./referenceable";
import {ConversationJson} from "../keml/json/sequence-diagram-models";
import {ConstructorPointers} from "../keml/parser/constructor-pointers";

/*
idea:
  1) store any element with complete xPath, on lookup during construction you trigger the creation if the object does not exist yet
  2) after returning from all triggered creations, finish your own job ;)
 */
export class Parser {

  private completeJSON: any;
  private constructorPointers: ConstructorPointers;

  private context: Map<string, any> = new Map<string, any>();

  constructor(conv: ConversationJson) {
    this.completeJSON = (conv as any);

    this.constructorPointers = new ConstructorPointers(this)
  }

  getJsonFromTree<T>(path: string): T {
    //first replace index access (.) by normal path divider, since they are all finally [] accesses
    const accessPaths = path.replaceAll('.', Ref.pathDivider).split(Ref.pathDivider)
      //path.split( new RegExp('(/@|\\.)'), -1)
    let res = this.completeJSON;
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
      return this.constructorPointers.get<T>(ref)
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
  static createRefList(formerPrefix: string, ownHeader: string, eClasses: string[] = []): Ref[] {
    const prefix = Ref.computePrefix(formerPrefix, ownHeader);
    console.log(eClasses)
    return eClasses.map((eClass, index) => new Ref(Ref.mixWithIndex(prefix, index), eClass))
  }

  static createSingleRef(formerPrefix: string, ownHeader: string, eClass: string): Ref {
    const ref = Ref.computePrefix(formerPrefix, ownHeader)
    return new Ref(ref, eClass)
  }

}
