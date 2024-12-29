import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {Information, Preknowledge, ReceiveMessage} from "../../shared/models/keml/msg-info";
import {MatDialog} from "@angular/material/dialog";
import {ModelIOService} from "../../shared/services/model-io.service";

@Component({
  selector: 'info-choice',
  templateUrl: './info-choice.component.html',
  styleUrl: './info-choice.component.css'
})
export class InfoChoiceComponent {

  @ViewChild('chooseinfo') modalRef!: TemplateRef<any>;
  @Input() info!: Information;
  @Output() infoChange = new EventEmitter<Information>();
  //graphical component to pick an info, hence it needs all messages and all preknowledge as input:
  preknowledges: Preknowledge[];
  receives: ReceiveMessage[];

  constructor(
    private dialog: MatDialog,
    public modelIOService: ModelIOService,
  ) {
    this.receives = this.modelIOService.getReceives()
    this.preknowledges = this.modelIOService.conversation.author.preknowledge;
    console.log(this.receives);
    console.log(this.preknowledges);
  }

  openChoice() {
    this.dialog.open(this.modalRef,{})
  }

  choose(info: Information) {
    this.info = info;
    this.infoChange.emit(info);
    this.dialog.closeAll()
  }

}
