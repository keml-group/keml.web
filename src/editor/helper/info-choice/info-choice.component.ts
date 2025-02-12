import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {Information, Preknowledge, ReceiveMessage} from "../../../shared/models/keml/msg-info";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModelIOService} from "../../../shared/services/model-io.service";
import { PreknowledgeComponent } from '../../preknowledge/preknowledge.component';
import { MsgComponent } from '../../msg/msg.component';
import { InfoInnerComponent } from '../info-inner/info-inner.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'info-choice',
    templateUrl: './info-choice.component.html',
    styleUrl: './info-choice.component.css',
    standalone: true,
    imports: [NgIf, InfoInnerComponent, NgFor, MsgComponent, PreknowledgeComponent]
})
export class InfoChoiceComponent {

  @ViewChild('chooseinfo') modalRef!: TemplateRef<any>;
  @Input() info?: Information;
  @Output() infoChange = new EventEmitter<Information>();
  //graphical component to pick an info, hence it needs all messages and all preknowledge as input:
  @Input() showInfo = true;
  preknowledges: Preknowledge[];
  receives: ReceiveMessage[];
  dialogRef?: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    public modelIOService: ModelIOService,
  ) {
    this.receives = this.modelIOService.getReceives()
    this.preknowledges = this.modelIOService.conversation.author.preknowledge;
  }

  openChoice(event: Event) {
    event.stopPropagation();
    this.dialogRef = this.dialog.open(this.modalRef,{})
  }

  choose(info: Information) {
    this.info = info;
    this.infoChange.emit(info);
    this.dialogRef?.close()
  }

}
