import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ConversationPartner} from "../../shared/models/keml/conversation-partner";
import {Message} from "../../shared/models/keml/msg-info";
import {ModelIOService} from "../../shared/services/model-io.service";

@Component({
  selector: 'cp-details',
  templateUrl: './cp-details.component.html',
  styleUrl: './cp-details.component.css'
})
export class ConversationPartnerDetailsComponent {
  @Input() cp!: ConversationPartner;
  @Input() msgs!: Message[];
  @Output() openOtherDetails = new EventEmitter<ConversationPartner>();
  cps: ConversationPartner[];

  constructor(
    public dialogRef: MatDialogRef<ConversationPartnerDetailsComponent>,
    public modelIOService: ModelIOService,
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
      this.dialogRef.close();
      this.openOtherDetails.emit(newCp);
    }
  }

}
