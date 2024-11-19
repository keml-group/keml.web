import {Author} from "../author";
import {NewInformation, Preknowledge} from "../msg-info";
import {Ref} from "./ref";

export class JsonFixer {

  // we can decide whether preknowledge or new info just by looking at the prefix of ref (however, this is hacky)
  static determineParentInfoClass(ref: string): string {
    let pathSegments = ref.split(Ref.pathDivider)
    let relevant = pathSegments[pathSegments.length-2]
    console.log(ref)
    console.log(relevant)
    if (relevant.startsWith(Author.preknowledgePrefix))
      return Preknowledge.eClass
    else return NewInformation.eClass
  }
}
