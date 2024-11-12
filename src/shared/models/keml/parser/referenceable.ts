import {Ref} from "./ref";

export abstract class Referencable {

  protected ref?: Ref;


  public getRef(): Ref {
    if (!this.ref) {
      throw 'No ref found for '+this+', did you set it?'
    }
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

  static listToRefs<T extends Referencable>(list: T[]): Ref[] {
    return list.map(elem => elem.getRef())
  }

}
