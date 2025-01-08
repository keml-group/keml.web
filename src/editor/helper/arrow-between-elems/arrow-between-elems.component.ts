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
import {SVGAccessService} from "../../../shared/services/svg-access.service";
import {Observable} from "rxjs";

@Component({
  selector: '[arrowElems]',
  templateUrl: './arrow-between-elems.component.svg',
  styleUrl: './arrow-between-elems.component.css'
})
export class ArrowBetweenElemsComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() startGID!: string;
  @Input() startSuffix!: string;
  @Input() endGID!: string;
  @Input() endSuffix!: string;
  @Input() arrowType: ArrowType = ArrowType.STANDARD;
  @Input() breaks: BoundingBox[] = [];
  @Input() text?: string;
  @Input() style?: string;

  startId!: string;
  endId!: string;

  start?: BoundingBox;
  end?: BoundingBox;

  positioned= false;
  @ViewChild('arrow') node!: ElementRef<SVGGraphicsElement>;

  changeNotifier: Observable<string>;

  //idea: compute the two input positions as relative to the current elem
  constructor(
    private svgAccessService: SVGAccessService,
    private cdr: ChangeDetectorRef) {
    this.changeNotifier = this.svgAccessService.listenToPositionChange()
  }

  ngOnInit() {
    this.startId = this.startGID+this.startSuffix;
    this.endId = this.endGID+this.endSuffix;
  }

  ngAfterViewInit() {
    console.log("Init done, start is "+this.startId)
    this.positioned = true;
    this.computePositionsByIds()
    this.cdr.detectChanges()
    this.changeNotifier.subscribe(nextString => {
      if (nextString == this.startGID || nextString == this.endGID) {
        this.computePositionsByIds()
      }
    })
  }

  ngOnChanges(_: SimpleChanges) {
    if(this.positioned) {
      this.computePositionsByIds()
    }
  }

  private computePositionsByIds() {
    if (this.node?.nativeElement){
      let rel = this.node.nativeElement as SVGGraphicsElement
      let startOpt = this.svgAccessService.getRelativePosition(this.startId, rel)
      if (startOpt) {
        this.start = startOpt
      }
      let endOpt = this.svgAccessService.getRelativePosition(this.endId, rel)
      if (endOpt) {
        this.end = endOpt
      }
    } else console.log('No native element yet')
  }

}
