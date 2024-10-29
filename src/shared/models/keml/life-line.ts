export abstract class LifeLine {
  name: string;
  xPosition: number; //int todo

  protected constructor(name: string, xPosition: number) {
    this.name = name;
    this.xPosition = xPosition;
  }

}
