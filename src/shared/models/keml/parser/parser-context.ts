import {Ref} from "./ref";

export class ParserContext {

  context: Map<string, any> = new Map<string, any>();

  serializationContext: Map<any, Ref> = new Map();

  get<T>(key: string): T {
    return (this.context.get(key) as T);
  }

  // todo when? on singletons? will we ever need that?
  put<T>(ref: string, elem: T ) {
    this.context.set(ref, elem);
  }

  putList<T>(formerPrefix: string, ownHeader: string, content: T[]) {
    const prefix = Ref.computePrefix(formerPrefix, ownHeader);
    content?.forEach((t: T, index) =>
      this.context.set(prefix+'.'+index, t)
    )
  }

  putForSerialization<T>(obj: T, ref: Ref) {
    this.serializationContext.set(obj, ref);
  }

  getRefForSerialization<T>(obj: T): Ref {
    let ref = this.serializationContext.get(obj);
    if(!ref) throw 'No ref found for '+obj;
    return ref;
  }

}
