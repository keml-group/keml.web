import {Ref} from "./ref";

export abstract class Referencable {

  protected ref?: Ref;


  getRef () {
    return this.ref;
  }

  abstract prepare(ownPos: string): void;

  static prepareList<T extends Referencable>(prefix: string, list: T[]): void {
    if (list?.length > 0) {
      list.map((ref: Referencable, index) => {
        ref.prepare(Ref.mixWithIndex(prefix, index))
      })
    }
  }

}
