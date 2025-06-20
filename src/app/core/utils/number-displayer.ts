export class NumberDisplayer {

  // expects input num between -1 and 1 and produces a string with two digits after the . and ... after them if the number was truncated
  public static displayNumWith1DigitBeforeSep(num?:number): string {
    if (num == undefined || isNaN(num)) {
      return '?'
    } else {
      let length = 4
      if (num < 0) {
        length = 5
      }
      let str = num.toString()
      if (str.length > length) {
        str = str.substring(0, length) + '..'
      }
      return str
    }
  }
}
