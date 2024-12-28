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
    this.modelIOService.deleteLink(this.infoLink);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    this.modelIOService.duplicateLink(this.infoLink);
    this.dialogRef.close();
    // todo open duplicate details (?)
  }


}
