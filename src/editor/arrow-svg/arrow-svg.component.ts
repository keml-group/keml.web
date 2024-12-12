import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ArrowHead, ArrowType} from "../../shared/models/graphical/arrow-heads";
import {BoundingBox} from "../../shared/models/graphical/bounding-box";
import {PathLayouter} from "../../shared/utility/path-layouter";
import {v4 as uuidv4} from "uuid";
import {PositionHelper} from "../../shared/models/graphical/position-helper";

@Component({
  selector: '[arrow-svg]',
  templateUrl: './arrow-svg.component.svg',
  styleUrl: './arrow-svg.component.css'
})
export class ArrowSvgComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() start!: BoundingBox;
  @Input() end!: BoundingBox;
  @Input() arrowType: ArrowType = ArrowType.STANDARD;
  @Input() breaks: BoundingBox[] = [];
  @Input() text?: string;
  @Input() style?: string;
  @Input() startId?: string;
  @Input() endId?: string;

  x1: number = 0;
  y1: number = 0;
  x2: number = 55;
  y2: number = 55;

  id = uuidv4();

  endType: ArrowHead = ArrowHead.POINTER;
  color: string = 'black';
  dashed = [0];

  @ViewChild('arrow') node!: ElementRef<SVGGraphicsElement>;

  ngOnInit() {
    this.computePositions()
    this.pickConfiguration()
  }

  ngAfterViewInit() {
    console.log(this.node.nativeElement.getBBox())
    //console.log(this.node.nativeElement.getScreenCTM())
    console.log(this.node.nativeElement.getCTM())
    console.log(this.node.nativeElement.getBoundingClientRect())
    console.log(PositionHelper.absolutePosition(this.node.nativeElement))
  }

  ngOnChanges() {
    if (!this.startId) {
      this.computePositions()
    } else {
      this.computePositionsByIds()
    }
    this.pickConfiguration()
  }

  private computePositionsByIds() {
    //Todo
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
