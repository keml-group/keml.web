import {Component, Input,} from '@angular/core';
import {Information, InformationLink, Preknowledge} from "../../../shared/models/keml/msg-info";
import {MatDialogRef} from "@angular/material/dialog";
import {ModelIOService} from "../../../shared/services/model-io.service";
import {InformationLinkType} from "../../../shared/models/keml/json/knowledge-models";
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { InfoChoiceComponent } from '../../helper/info-choice/info-choice.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-information-link-details',
    templateUrl: './information-link-details.component.html',
    styleUrl: './information-link-details.component.css',
    standalone: true,
    imports: [NgIf, InfoChoiceComponent, FormsModule, NgFor, MatIcon]
})
export class InformationLinkDetailsComponent {

  @Input() infoLink?: InformationLink;
  @Input() preknowledges!: Preknowledge[];
  @Input() newInfos!: Information[];

  // only for creation
  src?: Information;
  target?: Information;
  type?:InformationLinkType;
  text?: string;

  constructor(
    public dialogRef: MatDialogRef<InformationLinkDetailsComponent>,
    public modelIOService: ModelIOService,
  ) { }

  closeMe() {
    this.dialogRef.close();
  }

  deleteMe() {
    this.modelIOService.deleteLink(this.infoLink!);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    this.modelIOService.duplicateLink(this.infoLink!);
    this.dialogRef.close();
    // todo open duplicate details (?)
  }

  //only for create view
  createMe(): void {
    if (this.src && this.target && this.type) {
      this.modelIOService.addInformationLink(this.src, this.target, this.type, this.text)
      this.dialogRef.close();
    }
  }

  protected readonly InformationLinkType = InformationLinkType;
  protected readonly Object = Object;
}
