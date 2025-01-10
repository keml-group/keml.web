export class GeneralHelper {

  // ************** Helper *********************
  public static removeFromList<T>(elem: T, list: T[]): boolean {
    const index = list.indexOf(elem)
    if(index > -1) {
      list.splice(index, 1);
      return true;
    }
    return false;
  }

}
