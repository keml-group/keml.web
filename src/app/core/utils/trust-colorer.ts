export class TrustColorer {

  public static hexColor(trust?: number): string {
    if (trust == undefined || isNaN(trust) ) {
      return '#FFFFFF'
    }
    if (trust < 0) {
      return this.createNegative(trust)
    } else {
      return this.createPositive(trust)
    }
  }

  private static createNegative(trust: number): string {
    let factor = 1 + trust
    return '#ff'+this.computeTwoHexDigits(factor) +'00' //red
  }

  private static createPositive(trust: number): string {
    let factor = 1- trust
    return '#'+this.computeTwoHexDigits(factor)+'ff00' //green
  }

  //expects a number between 0 and 1
  private static computeTwoHexDigits(factor: number): string{
    let res = Math.round(factor * 255)
    let resStr =   res.toString(16)
    if(resStr.length==1){
      resStr = '0'+resStr
    }
    return resStr
  }
}
