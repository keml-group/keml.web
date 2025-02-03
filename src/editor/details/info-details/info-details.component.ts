import {Component, Input, OnInit,} from '@angular/core';
import {Information, NewInformation, ReceiveMessage} from "../../../shared/models/keml/msg-info";
import {MatDialogRef} from "@angular/material/dialog";
import {ModelIOService} from "../../../shared/services/model-io.service";
import {DetailsService} from "../service/details.service";
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MsgOverviewComponent } from '../../helper/msg-overview/msg-overview.component';
import { ArrowSvgComponent } from '../../helper/arrow-svg/arrow-svg.component';
import { InfoInnerComponent } from '../../helper/info-inner/info-inner.component';
import { MsgChoiceComponent } from '../../helper/msg-choice/msg-choice.component';
import { NgIf, NgFor } from '@angular/common';
import { IsInstrSvgComponent } from '../../helper/is-instr-svg/is-instr-svg.component';
import { FormsModule } from '@angular/forms';
import {MsgDetailsService} from "../service/msg-details.service";

@Component({
    selector: 'info-details',
    templateUrl: './info-details.component.html',
    styleUrl: './info-details.component.css',
    standalone: true,
    imports: [FormsModule, IsInstrSvgComponent, NgIf, MsgChoiceComponent, NgFor, InfoInnerComponent, ArrowSvgComponent, MsgOverviewComponent, MatIcon, MatTooltip]
})
export class InfoDetailsComponent implements OnInit {
  @Input() info!: Information;
  newInfo?: NewInformation;

  constructor(
    public modelIOService: ModelIOService,
    private dialogRef: MatDialogRef<InfoDetailsComponent>,
    public detailsService: DetailsService,
    public msgDetailsService: MsgDetailsService
  ) {}

  ngOnInit() {
    let newInfo: NewInformation = (this.info as NewInformation)
    if(newInfo.source) {
      this.newInfo = newInfo
    }
  }

  closeMe() {
    this.dialogRef.close();
  }

  deleteMe() {
    this.modelIOService.deleteInfo(this.info);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newInfo = this.modelIOService.duplicateInfo(this.info);
    if (newInfo) {
      this.dialogRef.close();
      this.detailsService.openInfoDetails(newInfo)
    }
  }

  changeSource(receive: ReceiveMessage) {
    if (this.newInfo){
      this.modelIOService.changeInfoSource(this.newInfo, receive)
    }
  }

}
