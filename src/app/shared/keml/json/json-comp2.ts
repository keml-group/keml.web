import {RefHandler} from "../../../../../../../../EMFular/projects/emfular/src/lib/referencing/ref/ref-handler";

export type warning = [string, string]

export class JsonComp2 {

  //static compare(subset: any, superset: any, errors: warning[], differences: warning[]): number {}

  private errors: warning[];
  private differences: warning[];
  subset: any;
  superset: any

  constructor(subset: any, superset: any) {
    this.errors = [];
    this.differences = [];
    this.subset = subset;
    this.superset = superset;

    this.compare();
  }

  public compare() {
    this.comp(this.subset, this.superset, '/');
    this.order()
  }

  private order() {
    //this.subset.sort((a: warning, b: warning) => a[0] - b[0]);
    //this.superset.sort((a: warning, b: warning) => a[0] <= b[0]);
  }

  public getDifferences() {
    return this.differences
  }

  public getErrors() {
    return this.errors
  }

  public isLessEquals(): boolean {
    return this.errors.length === 0;
  }

  private comp(subset: any, superset: any, ref: string) {
    this.typeComp(subset, superset, ref);
    this.contentComp(subset, superset, ref);
  }

  private typeComp(subset: any, superset: any, ref: string) {
    if (typeof subset !== typeof superset)
      this.errors.push(
        [ref,
          "Types " + (typeof subset) + " and " + (typeof superset) + " do not agree."
        ]
      )
  }

  private contentComp(subset: any, superset: any, ref: string) {
    let superEntries = Object.entries(superset)
    for (const entry of Object.entries(subset)) {
      let superEntry = superEntries.find(e => entry[0] == e[0]);
      if (!superEntry) {
        this.errors.push([ref, "Entry "+entry[0] + " is missing."])
      } else {
        // compare the two entries in depth
        let newRef = RefHandler.computePrefix(ref, entry[0])
        this.attrComp(entry[1], superEntry[1], newRef);
      }
    }
    this.identifyExtraEntriesOnSuperSet(subset, superset, ref)
  }

  private identifyExtraEntriesOnSuperSet(subset: any, superset: any, ref: string) {
    let subEntries = Object.entries(subset)
    for (const entry of Object.entries(superset)) {
      let match = subEntries.find(e => entry[0] == e[0]);
      if (!match) {
        this.differences.push([ref, "Entry \"+entry[0] + \" from superset is missing."])
      }
    }
  }

  private attrComp(subset: any, superset: any, ref: string) {
    //todo could be list, simple or object, need to distinguish here
    if(Array.isArray(subset)) {
      this.arrayComp(subset, superset, ref)
    } else {
      if(typeof subset == "object") {
        this.comp(subset, superset, ref)
      } else {//primitive
        let res = (subset === superset)
        if (!res) {
          this.errors.push([ref, "Attribute entry "+ subset + " and " + superset + " do not agree"])
        }
      }
    }
  }

  private arrayComp(subset: any[], superset: any, ref: string) {
    if (!Array.isArray(superset)) {
      this.errors.push([ref, 'The superset is no array'])
    } else {
      //let superArray = superset as any[];
      if (subset.length !== superset.length) {
        this.errors.push([ref, 'The arrays differ in length: '
        +subset.length + ' vs ' + superset.length]);
      } else {
        for(let i = 0; i < subset.length; i++) {
          let newRef = RefHandler.mixWithIndex(ref, i)
          this.comp(subset[i], superset[i], newRef)
        }
      }
    }
  }

}
