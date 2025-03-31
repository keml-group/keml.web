import {Referencable} from "@app/core/emfular/refs/referenceable";
import {Parser} from "@app/shared/keml/parser/parser";

export type ConstructorPointer = ($ref:string) => (p: Parser) => Referencable;
export type ConstructorPointers2 = Map<string, ConstructorPointer>;

