import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: '[trust-svg]',
  standalone: true,
  imports: [],
  templateUrl: './trust.component.svg',
  styleUrl: './trust.component.css'
})
export class TrustComponent implements OnInit, OnChanges {
  @Input() trust!: number;
  @Input() w!: number;
  @Input() h!: number;
  @Input() x: number = 0;
  @Input() y: number = 0;

  color: string = '#FFFFFF';

  ngOnInit() {
    this.color = this.computeColor()
  }

  ngOnChanges() {
    this.color = this.computeColor()
  }

  computeColor() {
    if (this.trust == undefined ) {
      return '#FFFFFF' // todo
    }
    if (this.trust < 0) {
      return this.createRed()
    } else {
      return this.createGreen()
    }
  }

  createRed() {
    let factor = 1 + this.trust
    return '#ff'+this.computeTwoHexDigits(factor) +'00'
  }

  createGreen() {
    let factor = 1- this.trust
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
