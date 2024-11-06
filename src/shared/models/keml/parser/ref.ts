export class Ref<T> {
  $ref: string;
  eClass?: string;
  content?: T;

  constructor(ref: string, eClass?: string) {
    this.$ref = ref;
    this.eClass = eClass;
  }

  static getIndexFromString(ref: string): number {
    let substrings = ref.split('.');
    return parseInt(substrings[substrings.length-1]);
  }
}
