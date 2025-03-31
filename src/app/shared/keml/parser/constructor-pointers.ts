import {Referencable} from "@app/core/emfular/refs/referenceable";
import {Parser} from "@app/shared/keml/parser/parser";

export type ConstructorPointer = ($ref:string) => (p: Parser) => Referencable;
export type ConstructorPointers2 = Map<string, ConstructorPointer>;

export abstract class ConstructorPointers {

  // key is the respective eClass
  constructorPointers: Map<string, ConstructorPointer >;

  protected constructor() {
    this.constructorPointers = new Map();
  }

  get(eClass:string): ConstructorPointer | undefined  {
    return this.constructorPointers.get(eClass)
  }
}
