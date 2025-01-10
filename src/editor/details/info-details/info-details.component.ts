import {Component, Input, OnInit,} from '@angular/core';
import {Information, NewInformation} from "../../../shared/models/keml/msg-info";
import {MatDialogRef} from "@angular/material/dialog";
import {ModelIOService} from "../../../shared/services/model-io.service";
import {DetailsService} from "../service/details.service";

@Component({
  selector: 'info-details',
  templateUrl: './info-details.component.html',
  styleUrl: './info-details.component.css'
})
export class InfoDetailsComponent implements OnInit {
  @Input() info!: Information;
  newInfo?: NewInformation;

  constructor(
    public modelIOService: ModelIOService,
    private dialogRef: MatDialogRef<InfoDetailsComponent>,
    public detailsService: DetailsService,
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

}
