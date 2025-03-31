import {Referencable} from "@app/core/emfular/refs/referenceable";
import {Ref} from "@app/core/emfular/refs/ref";

export abstract class LifeLine extends Referencable{
  name: string;
  xPosition: number; //int todo

  protected constructor(name: string, xPosition: number = 0, ref: Ref) {
    super(ref);
    this.name = name? name: '';
    this.xPosition = xPosition;
  }

}
