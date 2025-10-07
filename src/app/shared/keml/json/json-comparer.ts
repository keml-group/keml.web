import { RefHandler } from "emfular";

export type warning = [string, string]

export class ComparisonResult {
  private errors: warning[] = [];
  private differences: warning[] = [];

  public addError(err: warning) {
    this.errors.push(err);
  }

  public addDifference(difference: warning) {
    this.differences.push(difference)
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
}

export class JsonComparer {

  public static compare(subset: any, superset: any): ComparisonResult {
    let result = new ComparisonResult()
    if (Array.isArray(subset))
      this.arrayComp(subset, superset, '/', result)
    else
      this.comp(subset, superset, '/', result);
    return result;
  }

  private static comp(subset: any, superset: any, ref: string, result: ComparisonResult) {
    this.typeComp(subset, superset, ref, result);
    this.contentComp(subset, superset, ref, result);
  }

  private static typeComp(subset: any, superset: any, ref: string, result: ComparisonResult) {
    if (typeof subset !== typeof superset)
      result.addError(
        [ref,
          "Types " + (typeof subset) + " and " + (typeof superset) + " do not agree."
        ]
      )
  }

  private static contentComp(subset: any, superset: any, ref: string, result: ComparisonResult) {
    let superEntries = Object.entries(superset)
    for (const entry of Object.entries(subset)) {
      let superEntry = superEntries.find(e => entry[0] == e[0]);
      if (!superEntry) {
        result.addError([ref, "Entry "+ entry[0] + " is missing."])
      } else {
        // compare the two entries in depth
        let newRef = RefHandler.computePrefix(ref, entry[0])
        this.attrComp(entry[1], superEntry[1], newRef, result);
      }
    }
    this.identifyExtraEntriesOnSuperSet(subset, superset, ref, result)
  }

  private static identifyExtraEntriesOnSuperSet(subset: any, superset: any, ref: string, result: ComparisonResult) {
    let subEntries = Object.entries(subset)
    for (const entry of Object.entries(superset)) {
      let match = subEntries.find(e => entry[0] == e[0]);
      if (!match) {
        result.addDifference([ref, "Entry "+entry[0] + " from superset is missing."])
      }
    }
  }

  private static attrComp(subset: any, superset: any, ref: string, result: ComparisonResult) {
    //todo could be list, simple or object, need to distinguish here
    if(Array.isArray(subset)) {
      this.arrayComp(subset, superset, ref, result)
    } else {
      if(typeof subset == "object") {
        this.comp(subset, superset, ref, result)
      } else {//primitive
        let res = (subset === superset)
        if (!res) {
          result.addError([ref, "Attribute entry "+ subset + " and " + superset + " do not agree"])
        }
      }
    }
  }

  private static arrayComp(subset: any[], superset: any, ref: string, result: ComparisonResult) {
    if (!Array.isArray(superset)) {
      result.addError([ref, 'The superset is no array'])
    } else {
      //let superArray = superset as any[];
      if (subset.length !== superset.length) {
        result.addError([ref, 'The arrays differ in length: '
        +subset.length + ' vs ' + superset.length]);
      } else {
        if (this.isRef(subset[0])) {
          for(let i = 0; i < subset.length; i++) {
            let newRef = RefHandler.mixWithIndex(ref, i)
            let s = superset.find(e =>
              e["$ref"] == subset[i]["$ref"]);
            if (s != undefined) {
              this.comp(subset[i], s, newRef, result)
            } else {
              result.addError([ref, "No match on " + newRef + " for "+subset[i]["$ref"] ]);
            }
          }
        } else {
          for(let i = 0; i < subset.length; i++) {
            let newRef = RefHandler.mixWithIndex(ref, i)
            this.comp(subset[i], superset[i], newRef, result)
          }
        }
      }
    }
  }


  private static isRef(obj: any) {
    return obj["$ref"] != undefined
  }
}
