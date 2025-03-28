import {Component, Input} from '@angular/core';
import {InformationLink} from "@app/shared/keml/models/core/msg-info";
import {ArrowSvgComponent} from "@app/core/features/arrows/components/arrow-svg/arrow-svg.component";
import {InfoInnerComponent} from "@app/shared/keml/components/helper/info-inner/info-inner.component";

@Component({
  selector: '[info-link-short]',
  standalone: true,
  imports: [
    ArrowSvgComponent,
    InfoInnerComponent
  ],
  templateUrl: './info-link-short.component.svg',
  styleUrl: './info-link-short.component.css'
})
export class InfoLinkShortComponent {
  @Input() link!: InformationLink

}
