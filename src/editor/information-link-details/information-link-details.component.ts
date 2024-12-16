import {Component, Input} from '@angular/core';
import {Information, InformationLink, Preknowledge} from "../../shared/models/keml/msg-info";
import {MatDialogRef} from "@angular/material/dialog";
import {ModelIOService} from "../../shared/services/model-io.service";

@Component({
  selector: 'app-information-link-details',
  templateUrl: './information-link-details.component.html',
  styleUrl: './information-link-details.component.css'
})
export class InformationLinkDetailsComponent {

  @Input() infoLink!: InformationLink;
  @Input() preknowledges!: Preknowledge[];
  @Input() newInfos!: Information[];

  constructor(
    public dialogRef: MatDialogRef<InformationLinkDetailsComponent>,
    public modelIOService: ModelIOService,
  ) { }

  closeMe() {
    this.dialogRef.close();
  }

  deleteMe() {
    //todo this.modelIOService.deleteInfo(this.info, this.infos);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    /* todo const newInfo = this.modelIOService.duplicateInfo(this.info, this.infos);
    if (newInfo) {
      this.dialogRef.close();
      this.openOtherDetails.emit(newInfo);
    }*/
  }


}
