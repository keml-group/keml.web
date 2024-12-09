import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {InfoComponent} from "../info/info.component";
import {NewInformation} from "../../shared/models/keml/msg-info";
import {BoundingBox} from "../../shared/models/graphical/bounding-box";
import {LayoutHelper} from "../../shared/utility/layout-helper";

@Component({
  selector: '[newInfoG]',
  templateUrl: './new-info.component.svg',
  styleUrl: './new-info.component.css'
})
export class NewInfoComponent extends InfoComponent implements OnInit, OnChanges {
  @Input() override info!: NewInformation;

  sourcePos: BoundingBox;

  constructor() {
    super();
    this.sourcePos = new BoundingBox(0, 0, 10, 10);
  }

  ngOnInit(): void {
    this.sourcePos.y = (LayoutHelper.computeMessageY(this.info.source.timing) );
  }

  // todo necessary?
  ngOnChanges(_: SimpleChanges): void {
    this.sourcePos.y = (LayoutHelper.computeMessageY(this.info.source.timing) );
  }

}
