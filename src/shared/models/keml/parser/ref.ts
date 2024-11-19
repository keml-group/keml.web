
export class Ref {
  $ref: string;
  eClass?: string;

  static readonly pathDivider: string = '/@';

  constructor(ref: string, eClass?: string) {
    this.$ref = ref;
    this.eClass = eClass;
  }

  static getIndexFromString(ref: string): number {
    let substrings = ref.split('.');
    return parseInt(substrings[substrings.length-1]);
  }

  static computePrefix(formerPrefix: string, ownHeader: string): string {
    return formerPrefix+Ref.pathDivider+ownHeader;
  }

  static getParentAddress(ref: string): string {
    let pos = ref.lastIndexOf(this.pathDivider)
    return ref.substring(0, pos)
  }

  static mixWithIndex(prefix: string, index: number): string {
    return prefix+'.'+index;
  }

  public toString(): string {
    return `{ ${this.$ref}, ${this.eClass} }`
  }

}
