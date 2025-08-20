import {Component, Input} from '@angular/core';
import {InformationLink} from "@app/shared/keml/models/core/msg-info";
import {InfoInnerComponent} from "@app/shared/keml/graphical/helper/info-inner/info-inner.component";
import {ArrowBetweenBoxesComponent} from "ngx-svg-graphics";

@Component({
    selector: '[link-overview]',
  imports: [
    InfoInnerComponent,
    ArrowBetweenBoxesComponent
  ],
    templateUrl: './link-overview.component.svg',
    styleUrl: './link-overview.component.css'
})
export class LinkOverview {
  @Input() link!: InformationLink

}
