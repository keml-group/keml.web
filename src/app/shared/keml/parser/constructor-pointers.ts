import  {Ref} from "@app/core/emfular/refs/ref"
import {Referencable} from "@app/core/emfular/refs/referenceable";
import {Parser} from "@app/shared/keml/parser/parser";


export abstract class ConstructorPointers {

  constructorPointers: Map<string, (e:string) => (p: Parser) => Referencable >;

  protected constructor() {
    this.constructorPointers = new Map();
  }

  get<T extends Referencable>(ref: Ref, parser: Parser): T {
    let constrPointer: ((e: string) => ( parser: Parser ) => Referencable) | undefined = this.constructorPointers.get(ref.eClass)
    if (constrPointer) {
      let constr = constrPointer(ref.$ref)
      return (constr(parser) as T);
    } else {
      throw(`Constructor pointer for ${ref} not set.`);
    }
  }
}
