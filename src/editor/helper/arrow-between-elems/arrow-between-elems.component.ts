import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {BoundingBox} from "../../../shared/models/graphical/bounding-box";
import {ArrowType} from "../../../shared/models/graphical/arrow-heads";
import {PositionHelper} from "../../../shared/models/graphical/position-helper";
import {SVGAccessService} from "../../../shared/services/svg-access.service";

@Component({
  selector: '[arrowElems]',
  templateUrl: './arrow-between-elems.component.svg',
  styleUrl: './arrow-between-elems.component.css'
})
export class ArrowBetweenElemsComponent implements OnInit, AfterViewInit, OnChanges {

  //@Input() startBox?: BoundingBox;
  //@Input() endBox?: BoundingBox;
  @Input() arrowType: ArrowType = ArrowType.STANDARD;
  @Input() breaks: BoundingBox[] = [];
  @Input() text?: string;
  @Input() style?: string;
  @Input() startId?: string;
  @Input() endId?: string;

  start?: BoundingBox;
  end?: BoundingBox;

  positioned= false;
  @ViewChild('arrow') node!: ElementRef<SVGGraphicsElement>;

  //idea: compute the two input positions as relative to the current elem
  constructor(
    private svgAccessService: SVGAccessService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log("Init done, start is "+this.startId)
    this.computePositionsByIds()
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.positioned) {
      this.computePositionsByIds()
    }
  }

  private computePositionsByIds() {
    let startElem: SVGGraphicsElement | undefined = this.svgAccessService.getElemById(this.startId!)
    let endElem: SVGGraphicsElement | undefined = this.svgAccessService.getElemById(this.endId!)
    if (startElem && endElem) {
      let startAbs = PositionHelper.absolutePosition(startElem!)
      let endAbs = PositionHelper.absolutePosition(endElem!)
      console.log('pos of start '+ this.startId + ' is ' + startAbs)
      console.log('pos of end '+ this.endId + ' is ' + endAbs)
      if (this.node?.nativeElement){
        let el = this.node.nativeElement as SVGGraphicsElement
        PositionHelper.makeRelativeToElem(startAbs, el)
        PositionHelper.makeRelativeToElem(endAbs, el)
        this.start = startAbs
        this.end = endAbs
      } else
        console.log('No native element yet')
    } else {
      console.log('No elems yet')
    }
  }

}
