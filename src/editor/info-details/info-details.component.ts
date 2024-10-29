import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Information} from "../../shared/models/keml/information";
import {MatDialogRef} from "@angular/material/dialog";
import {ModelIOService} from "../../shared/services/model-io.service";

@Component({
  selector: 'info-details',
  templateUrl: './info-details.component.html',
  styleUrl: './info-details.component.css'
})
export class InfoDetailsComponent {
  @Input() info!: Information;
  @Input() infos!: Information[];
  @Output() openOtherDetails = new EventEmitter<Information>();

  constructor(
    public dialogRef: MatDialogRef<InfoDetailsComponent>,
    public modelIOService: ModelIOService,
  ) { }

  closeMe() {
    this.dialogRef.close();
  }

  deleteMe() {
    this.modelIOService.deleteInfo(this.info, this.infos);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newInfo = this.modelIOService.duplicateInfo(this.info, this.infos);
    if (newInfo) {
      this.dialogRef.close();
      this.openOtherDetails.emit(newInfo);
    }
  }

}
