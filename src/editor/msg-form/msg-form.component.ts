import {Component, Input} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ConversationPartner, Message} from "../../shared/models/sequence-diagram-models";
import {ModelIOService} from "../../shared/services/model-io.service";

@Component({
  selector: 'msg-form',
  templateUrl: './msg-form.component.html',
  styleUrl: './msg-form.component.css'
})
export class MsgFormComponent {
  @Input() msg!: Message;
  @Input() msgs!: Message[];
  @Input() cps!: ConversationPartner[];

  constructor(
    public dialogRef: MatDialogRef<MsgFormComponent>,
    public modelIOService: ModelIOService,
  ) { }

  onClose(): void {
    console.log(this.msg.timing);
    this.dialogRef.close();
  }

  moveUp() {
    this.modelIOService.moveMessageUp(this.msg, this.msgs);
  }

  disableMoveUp(): boolean {
    return this.modelIOService.disableMoveUp(this.msg);
  }

  moveDown() {
    this.modelIOService.moveMessageDown(this.msg, this.msgs);
  }

  disableMoveDown(): boolean {
    return this.modelIOService.disableMoveDown(this.msg, this.msgs)
  }

}
