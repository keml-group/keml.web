import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {PersonSvgComponent} from "../person-svg/person-svg.component";

@Component({
  selector: '[trust]',
  standalone: true,
  imports: [
    NgIf,
    PersonSvgComponent
  ],
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
      return '#666666' // todo
    }
    if (this.trust < 0) {
      return this.useRed()
    } else {
      return this.useGreen()
    }
  }

  useRed() {
    let factor = 1- this.trust
    let green = (factor * 160).toString(16)
    console.log(green)
    return '#ff'+green +'00'
  }

  useGreen() {
    let red = '80' // todo
    return '#'+red+'ff00'
  }

}
