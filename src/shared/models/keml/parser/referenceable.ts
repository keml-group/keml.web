import {Ref} from "./ref";
import { v4 as uuidv4 } from 'uuid';

export abstract class Referencable {

  protected ref?: Ref;
  gId: string;

  /* todo two open points:
      1) we could enforce eClass already here and use it instead if deferring that to the constructor,
      2) we could allow the parent to set the refpath so that we coul avoid the parameter of prepare
  * */

  singleChildren: Map<string, Referencable> = new Map();
  listChildren: Map<string, Referencable[]> = new Map();

  protected constructor(ref?: Ref) {
    this.ref = ref;
    this.gId = uuidv4();
  }

  public getRef(): Ref {
    if (!this.ref) {
      throw 'No ref found for '+this+', did you set it?'
    }
    return this.ref;
  }

  private setRef(ownPos: string) {
    this.ref = new Ref(ownPos, this.ref?.eClass)
  }

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
    if (list)
      return list.map(elem => elem.getRef())
    else
      return []
  }

  destruct() {
    this.singleChildren.forEach(child => {
      child.destruct()
    })
    this.listChildren.forEach(list => {
      list.forEach((ref: Referencable) => {
        ref.destruct()
      })
      list.splice(0, list.length)
    })
  }

}
