import {Component, Input, OnInit} from '@angular/core';
import {ArrowHead, BoundingBox} from "../../shared/models/graphical/graphical-types";

@Component({
  selector: '[arrow-svg]',
  templateUrl: './arrow-svg.component.svg',
  styleUrl: './arrow-svg.component.css'
})
export class ArrowSvgComponent implements OnInit{
  @Input() start!: BoundingBox;
  @Input() end!: BoundingBox;
  @Input() endType: ArrowHead = ArrowHead.POINTER;
  @Input() breaks: BoundingBox[] = [];
  @Input() text?: string;
  @Input() style?: CSSStyleDeclaration;

  x1: number = 0;
  y1: number = 0;
  x2: number = 55;
  y2: number = 55;

  ngOnInit() {
    this.computePositions()
  }

  computePositions() {
    this.x1 = this.start.x;
    this.y1 = this.start.y;
    this.x2 = this.end.x;
    this.y2 = this.end.y;
  }

  protected readonly ArrowHead = ArrowHead;
}
