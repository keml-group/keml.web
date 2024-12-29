import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {Information, Preknowledge, ReceiveMessage} from "../../shared/models/keml/msg-info";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'info-choice',
  templateUrl: './info-choice.component.html',
  styleUrl: './info-choice.component.css'
})
export class InfoChoiceComponent {

  constructor(
    private dialog: MatDialog,
  ) {}

  //graphical component to pick an info, hence it needs all messages and all preknowledge as input:
  @Input() preknowledges!: Preknowledge[];
  @Input() receives!: ReceiveMessage[];

  @Output() choice = new EventEmitter<Information>();

  @ViewChild('chooseinfo') modalRef!: TemplateRef<any>;

  openChoice() {
    this.dialog.open(this.modalRef,{})
  }

  choose(info: Information) {
    this.choice.emit(info);
  }

}
