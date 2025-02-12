import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import {ArrowHead, ArrowType} from "../../../shared/models/graphical/arrow-heads";
import {BoundingBox} from "../../../shared/models/graphical/bounding-box";
import {PathLayouter} from "../../../shared/utility/path-layouter";
import {v4 as uuidv4} from "uuid";
import {Point} from "@angular/cdk/drag-drop";
import { NgIf } from '@angular/common';

@Component({
    selector: '[arrow-svg]',
    templateUrl: './arrow-svg.component.svg',
    styleUrl: './arrow-svg.component.css',
    standalone: true,
    imports: [NgIf]
})
export class ArrowSvgComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() start!: BoundingBox;
  @Input() end!: BoundingBox;
  @Input() arrowType: ArrowType = ArrowType.STANDARD;
  @Input() breaks: BoundingBox[] = [];
  @Input() text?: string;
  @Input() style?: string;

  x1: number = 0;
  y1: number = 0;
  x2: number = 5;
  y2: number = 5;

  id = uuidv4();

  endType: ArrowHead = ArrowHead.POINTER;
  color: string = 'black';
  dashed = [0];

  positioned= false;

  constructor(
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    /*if (!this.startId) {
      this.computePositions()
    } else {
      this.computePositionsByIds()
    }
    this.pickConfiguration()*/
  }

  ngAfterViewInit() {
    this.computePositions()
    this.pickConfiguration()
    this.positioned = true;
    this.cdr.detectChanges();
  }

  ngOnChanges() {
    if(this.positioned) {
      this.computePositions()
      this.pickConfiguration()
    }
  }

  private pickConfiguration() {
    this.switchDashed()
    switch (this.arrowType) {
      case ArrowType.ATTACK:
      case ArrowType.STRONG_ATTACK: {
        this.endType = ArrowHead.ATTACK;
        this.color = 'red';
        break;
      }
      case ArrowType.SUPPORT:
      case ArrowType.STRONG_SUPPORT: {
        this.endType = ArrowHead.SUPPORT;
        this.color = 'green';
        break;
      }
      case ArrowType.SUPPLEMENT: {
        this.endType = ArrowHead.SUPPLEMENT;
        this.color = 'black';
        break;
      }
      default: {
        this.endType = ArrowHead.POINTER;
        this.color = 'black';
        break;
      }
    }
  }

  private switchDashed() {
    switch(this.arrowType) {
      case ArrowType.DASHED:
      case ArrowType.SUPPORT:
      case ArrowType.ATTACK: {
        this.dashed = [5]
        break;
      }
      default: {
        this.dashed = [0]
        break;
      }
    }
  }

  private computePositions() {
    let res = PathLayouter.bestPoints(this.start, this.end);
    this.applyBestPoints(res)
  }

  private applyBestPoints(res: Point[]) {
    this.x1 = res[0].x;
    this.y1 = res[0].y;
    this.x2 = res[1].x;
    this.y2 = res[1].y;
  }

  protected readonly ArrowHead = ArrowHead;
}
