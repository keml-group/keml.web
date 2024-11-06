export class IOHelper {

  static getIndexFromString(ref: string): number {
    let substrings = ref.split('.');
    return parseInt(substrings[substrings.length-1]);
  }

}
