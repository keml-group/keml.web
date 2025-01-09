export class GeneralHelper {

  // ************** Helper *********************
  public static removeFromList<T>(elem: T, list: T[]) {
    const index = list.indexOf(elem)
    if(index > -1) {
      list.splice(index, 1);
    }
  }

}
