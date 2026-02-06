import {Referencable, attribute} from "emfular";

export abstract class LifeLine extends Referencable{
  @attribute()
  name: string;
  @attribute()
  xPosition: number; //int todo

  protected constructor(name?: string, xPosition: number = 0) {
    super();
    this.name = name? name: '';
    this.xPosition = xPosition;
  }

}
