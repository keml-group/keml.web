import {Ref} from "./ref";
import {Referencable} from "./referenceable";

/*
idea:
  1) store any element with complete xPath, on lookup during construction you trigger a create if the object does not exist yet
  2) after returning from all triggered creations, finish your own job ;)
 */
export class ParserContext {

  context: Map<string, any> = new Map<string, any>();

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

}
