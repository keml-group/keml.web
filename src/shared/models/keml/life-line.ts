import {Referencable} from "../parser/referenceable";
import {Ref} from "../parser/ref";

export abstract class LifeLine extends Referencable{
  name: string;
  xPosition: number; //int todo

  protected constructor(name: string, xPosition: number = 0, ref: Ref) {
    super(ref);
    this.name = name? name: '';
    this.xPosition = xPosition;
  }

}
