import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {IsInstrSvgComponent} from "@app/shared/keml/graphical/helper/information/is-instr-svg/is-instr-svg.component";
import {MatIcon} from "@angular/material/icon";
import {MsgOverviewComponent} from "@app/shared/keml/graphical/helper/msg-overview/msg-overview.component";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Information} from "@app/shared/keml/core/msg-info";
import {LinkOverview} from "@app/shared/keml/graphical/helper/link-overview/link-overview.component";
import {TrustSliderComponent} from "@app/shared/keml/graphical/helper/trust/trust-slider/trust-slider.component";

@Component({
    selector: 'info-trust-details',
  imports: [
    IsInstrSvgComponent,
    MatIcon,
    MsgOverviewComponent,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    LinkOverview,
    TrustSliderComponent,
  ],
    templateUrl: './info-trust-details.component.html',
    styleUrl: './info-trust-details.component.css'
})
export class InfoTrustDetailsComponent {
  @Input() info!: Information
  @Output() infoChanged: EventEmitter<(number|undefined)> = new EventEmitter<(number|undefined)>()

  constructor(
    private dialogRef: MatDialogRef<InfoTrustDetailsComponent>,
  ) {}

  closeMe() {
    this.dialogRef.close();
  }
}
