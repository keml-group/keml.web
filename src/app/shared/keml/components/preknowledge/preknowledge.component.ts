import {Component, Input} from '@angular/core';
import { NgFor } from '@angular/common';
import {Preknowledge} from "@app/shared/keml/models/core/msg-info";
import {InfoComponent} from "@app/shared/keml/components/helper/info/info.component";
import { InfoInnerComponent } from '../helper/info-inner/info-inner.component';
import { InformationLinkComponent } from '../information-link/information-link.component';

@Component({
    selector: '[preknowG]',
    templateUrl: './preknowledge.component.svg',
    styleUrl: './preknowledge.component.css',
    imports: [InfoInnerComponent, NgFor, InformationLinkComponent]
})
export class PreknowledgeComponent extends InfoComponent {
  @Input() override info!: Preknowledge;
}
