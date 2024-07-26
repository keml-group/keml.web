export abstract class LifeLine {
  name: string;
  xPosition?: number; //int todo

  protected constructor(name: string) {
    this.name = name;
  }

}
