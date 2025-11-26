import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {KemlHistoryService} from "@app/shared/keml/edit/keml-history.service";

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

}
