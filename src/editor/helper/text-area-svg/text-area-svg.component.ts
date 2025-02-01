import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {BoundingBox} from "../../../shared/models/graphical/bounding-box";
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: '[text-area-svg]',
    templateUrl: './text-area-svg.component.svg',
    styleUrl: './text-area-svg.component.css',
    standalone: true,
    imports: [NgFor, NgIf, FormsModule]
})
export class TextAreaSvgComponent implements OnChanges {
  /*
  a fixed size svg. If the text exceeds the possible size, we will do a ... for now
   */

  @Input() text!: string
  @Input() x!: number
  @Input() y!: number
  @Input() w!: number
  @Input() h!: number
  @Input() singleEdit: boolean = false
  @Output() textChange = new EventEmitter<string>();
  //only with singleEdit since that opens an overlay where one can change the text in place

  distributedText: string[] = []
  isActive: boolean = false;


  ngOnChanges() {
    this.distributeText();
  }

  handleClick() {
    if(this.singleEdit) {
      this.isActive = true
    }
  }

  leaveTextInput() {
    this.textChange.emit(this.text)
    this.isActive = false;
  }

  distributeText(){
    let broken = this.text?.split(' ')
    if (broken?.length>=1) {
      let res = broken[0]
      let box = this.computeBB(res)
      let currentY = 0;
      let currentH = box.h;
      if (currentH <= this.h) {
        for (let i=1; i<broken.length; i++) {
          let word = broken[i]
          let testRes = res + ' ' + word
          box = this.computeBB(testRes)
          if (box.w <= this.w) { //go on with bigger width
            res = testRes
          } else {
            //start new line (if possible)
            box = this.computeBB(word)
            if (box.h + currentH > this.h) { // no new line possible:
              this.distributedText[currentY] = res+'...' //todo could be too long
              return;
            } else {
              this.distributedText[currentY] = res;
              currentY++;
              currentH +=box.h;
              res = word;
            }
          }
        }
        this.distributedText[currentY] = res;
      } else {
        console.error('Text area too low for text ' + this.text)
        this.distributedText = ['...']
      }
    } else this.distributedText = [];
  }

  computeBB(words: string): BoundingBox {
    return {x: 0, y:0, w: words.length*7.6, h: 20 }
  }

}
