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

  color: string = '#666666';

  ngOnInit() {
    this.color = this.computeColor()
  }

  ngOnChanges() {
    this.color = this.computeColor()
  }

  computeColor() {
    if (!this.trust ) {
      return '#FFFFFF' // todo
    }
    if (this.trust < 0) {
      return this.useRed()
    } else {
      return this.useGreen()
    }
  }

  useRed() {
    let factor = 1+ this.trust
    let green = this.computeTwoHexDigits(factor)
    console.log(green)
    return '#ff'+green +'00'
  }

  useGreen() {
    let factor = 1- this.trust
    let red = this.computeTwoHexDigits(factor)
    return '#'+red+'ff00'
  }

  //expects a number between 0 and 1
  private computeTwoHexDigits(factor: number): string{
    let res = (factor * 160).toString(16).substring(0,2)
    if(res.length==1){
      res = '0'+res
    }
    return res
  }

}
