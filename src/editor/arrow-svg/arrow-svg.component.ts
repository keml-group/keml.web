import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ArrowHead, ArrowType} from "../../shared/models/graphical/arrow-heads";
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
  @Input() arrowType: ArrowType = ArrowType.STANDARD;
  @Input() breaks: BoundingBox[] = [];
  @Input() text?: string;
  @Input() style?: string;

  x1: number = 0;
  y1: number = 0;
  x2: number = 55;
  y2: number = 55;

  endType: ArrowHead = ArrowHead.POINTER;
  color: string = 'black';
  dashed = [0];

  ngOnInit() {
    this.computePositions()
    this.pickConfiguration()
  }

  ngOnChanges() {
    this.computePositions()
    this.pickConfiguration()
  }

  private pickConfiguration() {
    this.switchDashed()
    switch (this.arrowType) {
      case ArrowType.ATTACK:
      case ArrowType.STRONG_ATTACK: {
        this.endType = ArrowHead.ATTACK;
        this.color = 'red';
        console.log("Attack")
        break;
      }
      case ArrowType.SUPPORT:
      case ArrowType.STRONG_SUPPORT: {
        this.endType = ArrowHead.SUPPORT;
        this.color = 'green';
        console.log('Support')
        break;
      }
      case ArrowType.SUPPLEMENT: {
        this.endType = ArrowHead.SUPPLEMENT;
        this.color = 'black';
        console.log('Supplement')
        break;
      }
      default: {
        this.endType = ArrowHead.POINTER;
        this.color = 'black';
        console.log('default')
        break;
      }
    }
  }

  private switchDashed() {
    switch(this.arrowType) {
      case ArrowType.DASHED:
      case ArrowType.SUPPORT:
      case ArrowType.ATTACK: {
        this.dashed[0] = 5
        break;
      }
      default: {
        this.dashed[0] = 0
        break;
      }
    }
  }

  private computePositions() {
    let res = PathLayouter.bestPoints(this.start, this.end);
    this.x1 = res[0].x;
    this.y1 = res[0].y;
    this.x2 = res[1].x;
    this.y2 = res[1].y;
  }

  protected readonly ArrowHead = ArrowHead;
}
