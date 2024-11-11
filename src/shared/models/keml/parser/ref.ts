
export class Ref {
  $ref: string;
  eClass?: string;

  constructor(ref: string, eClass?: string) {
    this.$ref = ref;
    this.eClass = eClass;
  }

  static getIndexFromString(ref: string): number {
    let substrings = ref.split('.');
    return parseInt(substrings[substrings.length-1]);
  }

  static computePrefix(formerPrefix: string, ownHeader: string): string {
    return formerPrefix+'/@'+ownHeader;
  }

  static mixWithIndex(prefix: string, index: number): string {
    return prefix+'.'+index;
  }

}
