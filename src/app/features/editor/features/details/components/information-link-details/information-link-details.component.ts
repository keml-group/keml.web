import {Component, Input,} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {MatDialogRef} from "@angular/material/dialog";
import { FormsModule } from '@angular/forms';
import {ModelIOService} from "@app/features/editor/services/model-io.service";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";
import {Information, InformationLink, Preknowledge} from "@app/shared/keml/models/core/msg-info";
import { InfoChoiceComponent } from '@app/shared/keml/components/helper/choices/info-choice/info-choice.component';

@Component({
    selector: 'app-information-link-details',
    templateUrl: './information-link-details.component.html',
    styleUrl: './information-link-details.component.css',
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
