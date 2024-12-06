import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ArrowHead} from "../../shared/models/graphical/arrow-heads";
import {BoundingBox} from "../../shared/models/graphical/bounding-box";
import {PathLayouter} from "../../shared/utility/path-layouter";

@Component({
  selector: '[arrow-svg]',
  templateUrl: './arrow-svg.component.svg',
  styleUrl: './arrow-svg.component.css'
})
export class ArrowSvgComponent implements OnInit, OnChanges {
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

  ngOnChanges() {
    this.computePositions()
  }

  computePositions() {
    let res = PathLayouter.bestPoints(this.start, this.end);
    this.x1 = res[0].x;
    this.y1 = res[0].y;
    this.x2 = res[1].x;
    this.y2 = res[1].y;
  }

  protected readonly ArrowHead = ArrowHead;
}
