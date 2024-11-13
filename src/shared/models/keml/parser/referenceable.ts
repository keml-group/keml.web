import {Ref} from "./ref";

export abstract class Referencable {

  protected ref?: Ref;

  singleChildren: Map<string, Referencable> = new Map();
  listChildren: Map<string, Referencable[]> = new Map();


  public getRef(): Ref {
    if (!this.ref) {
      throw 'No ref found for '+this+', did you set it?'
    }
    return this.ref;
  }

  setRef(ownPos: string) {
    this.ref = new Ref(ownPos, this.ref?.eClass)
  }

  //could assume that ref is already set, we will use its ref ;)
  prepare(ownPos: string) {
    this.setRef(ownPos)
    for (let single of this.singleChildren) {
      single[1].prepare(Ref.computePrefix(ownPos, single[0]));
    }
    for (let list of this.listChildren) {
      Referencable.prepareList(Ref.computePrefix(ownPos, list[0]) ,list[1])
    }
  }

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
