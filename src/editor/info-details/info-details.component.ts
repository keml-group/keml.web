import {Component, Input,} from '@angular/core';
import {Information} from "../../shared/models/keml/msg-info";
import {MatDialogRef} from "@angular/material/dialog";
import {ModelIOService} from "../../shared/services/model-io.service";
import {DetailsService} from "../details/service/details.service";

@Component({
  selector: 'info-details',
  templateUrl: './info-details.component.html',
  styleUrl: './info-details.component.css'
})
export class InfoDetailsComponent {
  @Input() info!: Information;

  constructor(
    public modelIOService: ModelIOService,
    private dialogRef: MatDialogRef<InfoDetailsComponent>,
    private detailsService: DetailsService,
  ) {}

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
