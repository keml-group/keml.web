import {Ref} from "@app/core/emfular/refs/ref";
import {Referencable} from "@app/core/emfular/refs/referenceable";
import {ConversationJson} from "@app/shared/keml/models/json/sequence-diagram-models";
import {ConstructorPointers} from "./constructor-pointers";
import {KEMLConstructorPointers} from "@app/shared/keml/parser/kemlconstructor-pointers";

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

    this.constructorPointers = new KEMLConstructorPointers()
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
      // construct via pointer....
      return this.create<T>(ref)
    }
  }

  private get<T extends Referencable>(key: string): T {
    return (this.context.get(key) as T);
  }

  private create<T extends Referencable>(ref: Ref): T {
    let constrPointer: ((e: string) => ( parser: Parser ) => Referencable) | undefined
      = this.constructorPointers.mapGet(ref.eClass)
    if (constrPointer) {
      let constr = constrPointer(ref.$ref)
      return (constr(this) as T);
    } else {
      throw(`Constructor pointer for ${ref} not set.`);
    }
  }

  put<T extends Referencable>(elem: T ) {
    this.context.set(elem.getRef().$ref, elem);
  }

  // for changing eClass assignment (i.e. on subtypes)
  static createRefList(formerPrefix: string, ownHeader: string, eClasses: string[] = []): Ref[] {
    const prefix = Ref.computePrefix(formerPrefix, ownHeader);
    let res = eClasses? eClasses : []
    return res.map((eClass, index) => new Ref(Ref.mixWithIndex(prefix, index), eClass))
  }

  static createSingleRef(formerPrefix: string, ownHeader: string, eClass: string): Ref {
    const ref = Ref.computePrefix(formerPrefix, ownHeader)
    return new Ref(ref, eClass)
  }

}
