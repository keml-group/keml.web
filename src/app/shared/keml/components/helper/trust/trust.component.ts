import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: '[trust-svg]',
  standalone: true,
  imports: [],
  templateUrl: './trust.component.svg',
  styleUrl: './trust.component.css'
})
export class TrustComponent implements OnInit, OnChanges {
  @Input() trust: number | undefined;
  @Input() w!: number;
  @Input() h!: number;
  @Input() x: number = 0;
  @Input() y: number = 0;

  color: string = '#FFFFFF';
  trust4Display: string = ''; //use to end after a certain number of digits

  ngOnInit() {
    this.determineRepresentationAndColor()
  }

  ngOnChanges() {
    this.determineRepresentationAndColor()
  }

  private determineRepresentationAndColor() {
    this.color = this.computeColor()
    this.trust4Display =this.computeTrust4Display()
  }

  computeTrust4Display(): string {
    if (this.trust == undefined || isNaN(this.trust)) {
      return '?'
    } else {
      if (this.trust == Infinity) {
        return '1'
      } else if (this.trust == -Infinity) {
        return '-1'
      }
      let str = this.trust.toString()
      if (str.length > 5) {
        str = str.substring(0,5)+'..'
      }
      return str
    }
  }

  computeColor() {
    if (this.trust == undefined || isNaN(this.trust) ) {
      return '#FFFFFF'
    }
    if (this.trust < 0) {
      return this.createRed()
    } else {
      return this.createGreen()
    }
  }

  createRed() {
    let factor = 1 + this.trust!
    return '#ff'+this.computeTwoHexDigits(factor) +'00'
  }

  createGreen() {
    let factor = 1- this.trust!
    return '#'+this.computeTwoHexDigits(factor)+'ff00'
  }

  //expects a number between 0 and 1
  computeTwoHexDigits(factor: number): string{
    let res = Math.round(factor * 255)
    let resStr =   res.toString(16)
    if(resStr.length==1){
      resStr = '0'+resStr
    }
    return resStr
  }

}
