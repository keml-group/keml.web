export abstract class LifeLine {
  name: string;
  xPosition?: number; //int todo

  protected constructor(name: string) {
    this.name = name;
  }

  fromJSON(json: string): LifeLine {
    return JSON.parse(json);
  }

  toJSON(): string {
    return JSON.stringify(this);
  }

}
