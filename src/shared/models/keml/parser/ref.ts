export class Ref {
  $ref: string;
  eClass?: string;

  constructor(ref: string, eClass?: string) {
    this.$ref = ref;
    this.eClass = eClass;
  }
}
