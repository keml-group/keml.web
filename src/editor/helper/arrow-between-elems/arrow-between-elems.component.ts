import {Component, Input, OnInit} from '@angular/core';
import {BoundingBox} from "../../../shared/models/graphical/bounding-box";
import {ArrowType} from "../../../shared/models/graphical/arrow-heads";

@Component({
  selector: '[arrowElems]',
  templateUrl: './arrow-between-elems.component.svg',
  styleUrl: './arrow-between-elems.component.css'
})
export class ArrowBetweenElemsComponent implements OnInit {

  @Input() startBox?: BoundingBox;
  @Input() endBox?: BoundingBox;
  @Input() arrowType: ArrowType = ArrowType.STANDARD;
  @Input() breaks: BoundingBox[] = [];
  @Input() text?: string;
  @Input() style?: string;
  @Input() startId?: string;
  @Input() endId?: string;

  start?: BoundingBox;
  end?: BoundingBox;

  ngOnInit() {
  }

}
