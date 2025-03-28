import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges,} from '@angular/core';
import { Point } from "@angular/cdk/drag-drop";
import { NgIf } from '@angular/common';
import {v4 as uuidv4} from "uuid";
import {BoundingBox} from "@app/core/features/arrows/models/bounding-box";
import {PathLayouter} from "@app/core/utils/path-layouter";
import {ArrowStyleConfiguration} from "@app/core/features/arrows/models/arrow-style-configuration";
import {ArrowTypeConfigurator} from "@app/core/features/arrows/utils/arrow-type-configurator";
import {ArrowMarkersComponent} from "@app/shared/keml/components/helper/arrow-markers/arrow-markers.component";
import {ArrowStyleConfigurationService} from "@app/core/services/arrow-style-configuration.service";

@Component({
    selector: '[arrow-svg]',
    templateUrl: './arrow-svg.component.svg',
    styleUrl: './arrow-svg.component.css',
    standalone: true,
  imports: [NgIf, ArrowMarkersComponent]
})
export class ArrowSvgComponent implements OnChanges, AfterViewInit {
  @Input() start!: BoundingBox;
  @Input() end!: BoundingBox;
  @Input() arrowType?: string;
//  @Input() breaks: BoundingBox[] = [];
  @Input() text?: string;
  @Input() style?: string;

  arrowStyleConfiguration: ArrowStyleConfiguration = ArrowTypeConfigurator.styleArrow();

  x1: number = 0;
  y1: number = 0;
  x2: number = 5;
  y2: number = 5;

  id = uuidv4();

  positioned= false;

  constructor(
    private cdr: ChangeDetectorRef,
    private arrowStyleConfigService: ArrowStyleConfigurationService,) {
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
    this.arrowStyleConfiguration = ArrowTypeConfigurator.styleArrow(this.arrowType)
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

}
