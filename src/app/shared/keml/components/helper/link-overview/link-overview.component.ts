import {Component, Input} from '@angular/core';
import {InformationLink} from "@app/shared/keml/models/core/msg-info";
import {ArrowSvgComponent} from "@app/core/features/arrows/components/arrow-svg/arrow-svg.component";
import {InfoInnerComponent} from "@app/shared/keml/components/helper/info-inner/info-inner.component";

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
