export class GeneralHelper {

  // ************** Helper *********************
  public static removeFromList<T>(elem: T, list: T[]) {
    let index = list.indexOf(elem)
    if(index > -1) {
      list.splice(index, 1);
    }
  }
  
}
