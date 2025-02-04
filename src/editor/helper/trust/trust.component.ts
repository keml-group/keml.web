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
    return '#666666' // todo
  }

}
