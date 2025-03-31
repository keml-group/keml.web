import {Referencable} from "@app/core/emfular/refs/referenceable";
import {Parser} from "@app/shared/keml/parser/parser";


export abstract class ConstructorPointers {

  // key is the respective eClass
  constructorPointers: Map<string, (e:string) => (p: Parser) => Referencable >;

  protected constructor() {
    this.constructorPointers = new Map();
  }

  mapGet(eClass:string): ((e: string) => ( parser: Parser ) => Referencable) | undefined  {
    return this.constructorPointers.get(eClass)
  }
}
