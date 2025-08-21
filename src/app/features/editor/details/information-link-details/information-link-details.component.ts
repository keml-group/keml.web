import {Component, Input,} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {MatDialogRef} from "@angular/material/dialog";
import { FormsModule } from '@angular/forms';
import {KemlService} from "@app/shared/keml/core/keml.service";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";
import {Information, InformationLink, Preknowledge} from "@app/shared/keml/core/msg-info";
import { InfoChoiceComponent } from '@app/shared/keml/graphical/helper/information/info-choice/info-choice.component';

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
    public kemlService: KemlService,
  ) { }

  closeMe() {
    this.dialogRef.close();
  }

  deleteMe() {
    this.kemlService.deleteLink(this.infoLink!);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    this.kemlService.duplicateLink(this.infoLink!);
    this.dialogRef.close();
    // todo open duplicate details (?)
  }

  //only for create view
  createMe(): void {
    if (this.src && this.target && this.type) {
      this.kemlService.addInformationLink(this.src, this.target, this.type, this.text)
      this.dialogRef.close();
    }
  }

  protected readonly InformationLinkType = InformationLinkType;
  protected readonly Object = Object;
}
