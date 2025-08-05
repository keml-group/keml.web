import {BoundingBox} from "ngx-svg-graphics";

export class TextDistributor {

  static computeBB(words: string): BoundingBox {
    return {x: 0, y:0, w: words.length*7.6, h: 20 }
  }

  static distributeText(text: string, area: BoundingBox): string[] {
    let distributedText: string[] = [];

    let broken = text?.split(' ')
    if (broken?.length>=1) {
      let res = broken[0]
      let box = this.computeBB(res)
      let currentY = 0;
      let currentH = box.h;
      if (currentH <= area.h) {
        for (let i=1; i<broken.length; i++) {
          let word = broken[i]
          let testRes = res + ' ' + word
          box = this.computeBB(testRes)
          if (box.w <= area.w) { //go on with bigger width
            res = testRes
          } else {
            //start new line (if possible)
            box = this.computeBB(word)
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
