import {Component, Input} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ConversationPartner} from "../../../shared/models/keml/conversation-partner";
import {ModelIOService} from "../../../shared/services/model-io.service";
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'cp-details',
    templateUrl: './cp-details.component.html',
    styleUrl: './cp-details.component.css',
    standalone: true,
    imports: [FormsModule, MatIcon]
})
export class ConversationPartnerDetailsComponent {
  @Input() cp!: ConversationPartner;
  cps: ConversationPartner[];

  constructor(
    public dialogRef: MatDialogRef<ConversationPartnerDetailsComponent>,
    private modelIOService: ModelIOService
  ) {
    this.cps = modelIOService.getConversationPartners();
  }

  closeMe(): void {
    this.dialogRef.close();
  }

  moveLeft() {
    this.modelIOService.moveConversationPartnerLeft(this.cp);
  }

  disableMoveLeft(): boolean {
    return this.modelIOService.disableMoveConversationPartnerLeft(this.cp);
  }

  moveRight() {
    this.modelIOService.moveConversationPartnerRight(this.cp);
  }

  disableMoveRight(): boolean {
    return this.modelIOService.disableMoveConversationPartnerRight(this.cp)
  }

  deleteMe() {
    this.modelIOService.deleteConversationPartner(this.cp);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newCp = this.modelIOService.duplicateConversationPartner(this.cp);
    if (newCp) {
      //change current perspective to duplicate:
      this.cp = newCp
    }
  }

}
