export class IOHelper {

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

  static isSend(eclass: string): boolean {
    return eclass.endsWith("SendMessage");
  }
}
