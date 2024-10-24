import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ConversationPartner, Message} from "../../shared/models/sequence-diagram-models";
import {ModelIOService} from "../../shared/services/model-io.service";

@Component({
  selector: 'cp-details',
  templateUrl: './cp-details.component.html',
  styleUrl: './cp-details.component.css'
})
export class ConversationPartnerDetailsComponent {
  @Input() cp!: ConversationPartner;
  @Input() msgs!: Message[];
  @Input() cps!: ConversationPartner[];
  @Output() openOtherDetails = new EventEmitter<ConversationPartner>();

  constructor(
    public dialogRef: MatDialogRef<ConversationPartnerDetailsComponent>,
    public modelIOService: ModelIOService,
  ) { }

  closeMe(): void {
    this.dialogRef.close();
  }

  moveLeft() {
    this.modelIOService.moveConversationPartnerLeft(this.cp, this.cps);
  }

  disableMoveLeft(): boolean {
    return this.modelIOService.disableMoveConversationPartnerLeft(this.cp, this.cps);
  }

  moveRight() {
    this.modelIOService.moveConversationPartnerRight(this.cp, this.cps);
  }

  disableMoveRight(): boolean {
    return this.modelIOService.disableMoveConversationPartnerRight(this.cp, this.cps)
  }

  deleteMe() {
    this.modelIOService.deleteConversationPartner(this.cp, this.cps);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newCp = this.modelIOService.duplicateConversationPartner(this.cp, this.cps);
    if (newCp) {
      this.dialogRef.close();
      this.openOtherDetails.emit(newCp);
    }
  }

}
