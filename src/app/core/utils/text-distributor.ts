import {BoundingBox} from "ngx-svg-graphics";

export class TextDistributor {

  private static determineOneLineBB(words: string): BoundingBox {
    return {x: 0, y:0, w: words.length*7.6, h: 20 }
  }

  // idea: distribute words over lines,
  // if a single word is too long for a line, cut it early enough to have three dots afterwards
  // if you need to indicate that there is more text after the last complete word, also use three dots, but after a break
  static distributeText(text: string, area: BoundingBox): string[] {
    let distributedText: string[] = [];

    let broken = text?.split(' ')
    if (broken?.length>=1) {
      let res = broken[0]
      let box = this.determineOneLineBB(res)
      let currentY = 0;
      let currentH = box.h;
      if (currentH <= area.h) {
        for (let i=1; i<broken.length; i++) {
          let word = broken[i]
          let testRes = res + ' ' + word
          box = this.determineOneLineBB(testRes)
          if (box.w <= area.w) { //go on with bigger width
            res = testRes
          } else {
            //start new line (if possible)
            box = this.determineOneLineBB(word)
            if (box.h + currentH > area.h) { // no new line possible:
              distributedText[currentY] = res+'...' //todo could be too long
              return distributedText;
            } else {
              distributedText[currentY] = res;
              currentY++;
              currentH +=box.h;
              res = word;
            }
          }
        }
        distributedText[currentY] = res;
      } else {
        console.error('Text area too low for text ' + text)
        distributedText = ['...']
      }
    }
    return distributedText
  }
}
