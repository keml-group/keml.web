import {Component, Input} from '@angular/core';
import {InfoComponent} from "../info/info.component";
import {NewInformation} from "../../shared/models/keml/msg-info";
import { InformationLinkComponent } from '../information-link/information-link.component';
import { NgFor } from '@angular/common';
import { ArrowSvgComponent } from '../helper/arrow-svg/arrow-svg.component';
import {InfoInnerComponent} from "../helper/info-inner/info-inner.component";

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
