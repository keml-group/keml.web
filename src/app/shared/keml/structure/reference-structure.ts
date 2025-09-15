export class ReferenceStructure {
  readonly name: string;
  isList: boolean = false; //todo later use min and maxCounts or sth similar
  inverse?: ReferenceStructure

  constructor(name: string, isList?: boolean, inverse?: ReferenceStructure) {
    this.name = name;
    if (isList) {
      this.isList = isList;
    }
    this.inverse = inverse;
  }

}
