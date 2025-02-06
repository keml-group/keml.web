import {Component, Input} from '@angular/core';
import {Preknowledge} from "../../shared/models/keml/msg-info";
import {InfoComponent} from "../info/info.component";
import { InformationLinkComponent } from '../information-link/information-link.component';
import { NgFor } from '@angular/common';
import { InfoInnerComponent } from '../helper/info-inner/info-inner.component';

@Component({
    selector: '[preknowG]',
    templateUrl: './preknowledge.component.svg',
    styleUrl: './preknowledge.component.css',
    standalone: true,
    imports: [InfoInnerComponent, NgFor, InformationLinkComponent]
})
export class PreknowledgeComponent extends InfoComponent {
  @Input() override info!: Preknowledge;
  @Input() showTrust = false;

}
