import {Referencable} from "./parser/referenceable";

export abstract class LifeLine extends Referencable{
  name: string;
  xPosition: number; //int todo

  protected constructor(name: string, xPosition: number) {
    super();
    this.name = name;
    this.xPosition = xPosition;
  }

}
