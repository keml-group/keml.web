import {Component, Input} from '@angular/core';
import {InfoComponent} from "@app/shared/keml/components/helper/info/info.component";
import { NgFor } from '@angular/common';
import {NewInformation} from "@app/shared/keml/models/core/msg-info";
import {InfoInnerComponent} from "../helper/info-inner/info-inner.component";
import { InformationLinkComponent } from '../information-link/information-link.component';
import {ArrowSvgComponent} from "ngx-arrows";

@Component({
    selector: '[newInfoG]',
    templateUrl: './new-info.component.svg',
    styleUrl: './new-info.component.css',
    standalone: true,
  imports: [ ArrowSvgComponent, NgFor, InformationLinkComponent, InfoInnerComponent]
})
export class NewInfoComponent extends InfoComponent {
  @Input() override info!: NewInformation;
  @Input() showTrust = false;

}
