import {Component, Input} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from "@angular/material/dialog";
import { KemlService } from "@app/features/editor/services/keml.service";
import { ConversationPartner } from "@app/shared/keml/core/conversation-partner";

@Component({
    selector: 'cp-details',
    templateUrl: './cp-details.component.html',
    styleUrl: './cp-details.component.css',
    imports: [FormsModule, MatIcon]
})
export class ConversationPartnerDetailsComponent {
  @Input() cp!: ConversationPartner;
  cps: ConversationPartner[];

  constructor(
    public dialogRef: MatDialogRef<ConversationPartnerDetailsComponent>,
    public kemlService: KemlService
  ) {
    this.cps = kemlService.getConversationPartners();
  }

  closeMe(): void {
    this.dialogRef.close();
  }

  deleteMe() {
    this.kemlService.deleteConversationPartner(this.cp);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newCp = this.kemlService.duplicateConversationPartner(this.cp);
    if (newCp) {
      //change current perspective to duplicate:
      this.cp = newCp
    }
  }

}
