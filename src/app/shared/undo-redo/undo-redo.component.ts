import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {KemlHistoryService} from "@app/shared/keml/edit/keml-history.service";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";

@Component({
  selector: 'undo-redo',
  imports: [
    MatIcon
  ],
  templateUrl: './undo-redo.component.html',
  styleUrl: './undo-redo.component.css'
})
export class UndoRedoComponent {


  constructor(
    public history: KemlHistoryService,
  ) {}

  @Output() undoRedo: EventEmitter<ConversationJson> = new EventEmitter<ConversationJson>();

  onUndo() {
    let res = this.history.undo()
    if (res) {
      this.undoRedo.emit(res)
    }
  }

  onRedo() {
    let res = this.history.redo()
    if (res) {
      this.undoRedo.emit(res)
    }
  }
}
