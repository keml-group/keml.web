import {Referencable} from "@app/core/emfular/refs/referenceable";
import {Parser} from "@app/shared/keml/parser/parser";

export type ConstructorPointer = ($ref:string) => (p: Parser) => Referencable;
export type ConstructorPointerFor<T extends Referencable> = ($ref:string) => (p: Parser) => T;

export type ConstructorPointers = Map<string, ConstructorPointer>;

