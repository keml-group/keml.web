import {Component, Input} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ArrowSvgComponent} from "@app/core/features/arrows/components/arrow-svg/arrow-svg.component";
import {InfoInnerComponent} from "@app/shared/keml/components/helper/info-inner/info-inner.component";
import {IsInstrSvgComponent} from "@app/shared/keml/components/helper/is-instr-svg/is-instr-svg.component";
import {MatIcon} from "@angular/material/icon";
import {MsgChoiceComponent} from "@app/shared/keml/components/helper/choices/msg-choice/msg-choice.component";
import {MsgOverviewComponent} from "@app/shared/keml/components/helper/msg-overview/msg-overview.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Information} from "@app/shared/keml/models/core/msg-info";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'info-trust-details',
  standalone: true,
  imports: [
    ArrowSvgComponent,
    InfoInnerComponent,
    IsInstrSvgComponent,
    MatIcon,
    MsgChoiceComponent,
    MsgOverviewComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatTooltip
  ],
  templateUrl: './info-trust-details.component.html',
  styleUrl: './info-trust-details.component.css'
})
export class InfoTrustDetailsComponent {
  @Input() info!: Information

  constructor(
    private dialogRef: MatDialogRef<InfoTrustDetailsComponent>,
  ) {}

  closeMe() {
    this.dialogRef.close();
  }
}
