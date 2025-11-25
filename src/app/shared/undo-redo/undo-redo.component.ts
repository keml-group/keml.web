import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HistoryService} from "@app/shared/history.service";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'undo-redo',
  imports: [
    MatIcon
  ],
  templateUrl: './undo-redo.component.html',
  styleUrl: './undo-redo.component.css'
})
export class UndoRedoComponent<T> {

  @Input() history!: HistoryService<T>
  @Output() undoRedo: EventEmitter<T> = new EventEmitter<T>();

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
