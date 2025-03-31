import {Ref} from "@app/core/emfular/referencing/ref";
import {Referencable} from "@app/core/emfular/referencing/referenceable";
import {ConstructorPointer, ConstructorPointers} from "@app/core/emfular/parsing/constructor-pointers";

/*
idea:
  1) store any element with complete xPath, on lookup during construction you trigger the creation if the object does not exist yet
  2) after returning from all triggered creations, finish your own job ;)
 */
export class Parser {

  private readonly completeJSON: any;
  private readonly constructorPointers: Map<string, ConstructorPointer>;

  // all so far parsed objects
  private context: Map<string, any> = new Map<string, any>();

  constructor(json: any, constructorPointers: ConstructorPointers) {
    this.completeJSON = json;
    this.constructorPointers = constructorPointers
  }

  getJsonFromTree<T>($ref: string): T {
    //first replace index access (.) by normal $ref divider, since they are all finally [] accesses
    const accessPaths = $ref.replaceAll('.', Ref.pathDivider).split(Ref.pathDivider)
    let res = this.completeJSON;
    for (let i = 1; i<accessPaths.length; i++) {
      res = res[(accessPaths[i])]
    }
    return (res as T);
  }

  getOrCreate<T extends Referencable>(ref: Ref): T {
    //get constructor from ref.eClass
    let res = this.get<T>(ref.$ref)
    if (res)
      return res
    else {
      // construct via pointer....
      return this.create<T>(ref)
    }
  }

  private get<T extends Referencable>($ref: string): T {
    return (this.context.get($ref) as T);
  }

  private create<T extends Referencable>(ref: Ref): T {
    let constrPointer: ConstructorPointer | undefined
      = this.constructorPointers.get(ref.eClass)
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

  // for setting eClass assignment (i.e. on subtypes)
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
