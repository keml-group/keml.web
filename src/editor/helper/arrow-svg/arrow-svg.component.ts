import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import {ArrowHead, ArrowType} from "../../../shared/models/graphical/arrow-heads";
import {BoundingBox} from "../../../shared/models/graphical/bounding-box";
import {PathLayouter} from "../../../shared/utility/path-layouter";
import {v4 as uuidv4} from "uuid";
import {PositionHelper} from "../../../shared/models/graphical/position-helper";
import {SVGAccessService} from "../../../shared/services/svg-access.service";
import {Point} from "@angular/cdk/drag-drop";

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
  x2: number = 5;
  y2: number = 5;

  id = uuidv4();

  endType: ArrowHead = ArrowHead.POINTER;
  color: string = 'black';
  dashed = [0];

  initialized = false;
  positioned= false;

  @ViewChild('arrow') node!: ElementRef<SVGGraphicsElement>;

  constructor(
    private svgAccessService: SVGAccessService,
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
    this.initialized = true;
    console.log("Init done, start is "+this.startId)
    if (!this.startId) {
      this.computePositions()
    } else {
      this.computePositionsByIds()
    }
    this.pickConfiguration()
    this.positioned = true;
    this.cdr.detectChanges();
  }

  ngOnChanges() {
    if(this.positioned) {
      if (!this.startId) {
        this.computePositions()
      } else {
        this.computePositionsByIds()
      }
      this.pickConfiguration()
    }
  }

  private computePositionsByIds() {
    let start: SVGGraphicsElement | undefined = this.svgAccessService.getElemById(this.startId!)
    let end: SVGGraphicsElement | undefined = this.svgAccessService.getElemById(this.endId!)
    if (start && end) {
      let startAbs = PositionHelper.absolutePosition(start!)
      let endAbs = PositionHelper.absolutePosition(end!)
      console.log('pos of start '+ this.startId + ' is ' + startAbs)
      console.log('pos of end '+ this.endId + ' is ' + endAbs)
      let res = PathLayouter.bestPoints(startAbs, endAbs);
      console.log('pos of best points are: (' + res[0].x + ', ' + res[0].y + ') and ('+ res[1].x + ', ' + res[1].y + ')')
      this.applyBestPoints(res)
      if (this.node?.nativeElement){
        let el = this.node.nativeElement as SVGGraphicsElement
        PositionHelper.makeRelativeToElem(res[0], el)
        PositionHelper.makeRelativeToElem(res[1], el)
        this.applyBestPoints(res)
      } else
        console.log('No native element yet')
    } else {
      console.log('No elems yet')
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
