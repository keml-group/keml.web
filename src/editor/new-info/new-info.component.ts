import {Component, Input} from '@angular/core';
import {InfoComponent} from "../info/info.component";
import {NewInformation} from "../../shared/models/keml/msg-info";
import { InformationLinkComponent } from '../information-link/information-link.component';
import { NgFor } from '@angular/common';
import { ArrowSvgComponent } from '../helper/arrow-svg/arrow-svg.component';
import { TextAreaSvgComponent } from '../helper/text-area-svg/text-area-svg.component';
import { IsInstrSvgComponent } from '../helper/is-instr-svg/is-instr-svg.component';

@Component({
    selector: '[newInfoG]',
    templateUrl: './new-info.component.svg',
    styleUrl: './new-info.component.css',
    standalone: true,
    imports: [IsInstrSvgComponent, TextAreaSvgComponent, ArrowSvgComponent, NgFor, InformationLinkComponent]
})
export class NewInfoComponent extends InfoComponent {
  @Input() override info!: NewInformation;

}
