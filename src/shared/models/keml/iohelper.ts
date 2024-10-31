export class IOHelper {

  static generateRefMap<T> (list: T[], mapPrefix: string, newHeader: string ): Map<string, T> {
    let map: Map<string, T> = new Map();
    list.forEach((t: T, index) => map.set(mapPrefix+'/@'+newHeader+'.'+index, t))
    return map;
  }

  static getIndexFromString(ref: string): number {
    let substrings = ref.split('.');
    return parseInt(substrings[substrings.length-1]);
  }

  static resolveConversationPartnerReference(ref: string): number {
    // form is //@conversationPartners.<digits> - so we just remove a prefix
    let length = "//@conversationPartners.".length;
    return parseInt(ref.substring(length))
  }

  static createConversationPartnerRef(index: number): string {
    return "//@conversationPartners."+index;
  }

  static findIndexOnArray<T>(obj: T, arr: T[]): number {
    return arr.findIndex(x => x == obj);
  }
}
