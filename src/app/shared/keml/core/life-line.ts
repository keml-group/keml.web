import {Ref, Referencable} from "emfular";
import {LifeLineJson} from "@app/shared/keml/json/sequence-diagram-models";


export abstract class LifeLine extends Referencable{
  name: string;
  xPosition: number; //int todo

  protected constructor(ref: Ref, name?: string, xPosition: number = 0) {
    super(ref);
    this.name = name? name: '';
    this.xPosition = xPosition;
  }

  override toJson(): LifeLineJson {
    return {
      name: this.name,
      xPosition: this.xPosition
    };
  }

}
