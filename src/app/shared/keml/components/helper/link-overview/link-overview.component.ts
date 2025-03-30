import {Component, Input} from '@angular/core';
import {InformationLink} from "@app/shared/keml/models/core/msg-info";
import {InfoInnerComponent} from "@app/shared/keml/components/helper/info-inner/info-inner.component";
import {ArrowSvgComponent} from "ngx-arrows";

@Component({
  selector: '[link-overview]',
  standalone: true,
  imports: [
    ArrowSvgComponent,
    InfoInnerComponent
  ],
  templateUrl: './link-overview.component.svg',
  styleUrl: './link-overview.component.css'
})
export class LinkOverview {
  @Input() link!: InformationLink

}
