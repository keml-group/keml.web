import {Component, Input, OnInit} from '@angular/core';
import {InformationLink} from "@app/shared/keml/models/core/msg-info";
import {ArrowSvgComponent} from "@app/core/features/arrows/components/arrow-svg/arrow-svg.component";
import {InfoInnerComponent} from "@app/shared/keml/components/helper/info-inner/info-inner.component";
import {ArrowStyleConfiguration} from "@app/core/features/arrows/models/arrow-style-configuration";
import {ArrowTypeConfigurator} from "@app/core/features/arrows/utils/arrow-type-configurator";

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
export class LinkOverview implements OnInit {
  @Input() link!: InformationLink

  config!: ArrowStyleConfiguration;

  ngOnInit(): void {
    this.config = ArrowTypeConfigurator.styleArrow(this.link.type)
  }

}
