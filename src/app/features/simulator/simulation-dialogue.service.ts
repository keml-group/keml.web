import { Injectable } from '@angular/core';
import {Conversation} from "@app/shared/keml/core/conversation";
import {SimulatorComponent} from "@app/features/simulator/simulator/simulator.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class SimulationDialogueService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openSimulationDialog(conversation: Conversation) {
    const dialogRef = this.dialog.open(
      SimulatorComponent,
      {
        width: '100vw',
        maxWidth: '100vw', //otherwise it is 80, see https://stackoverflow.com/questions/46034619/angular-material-2-how-to-overwrite-dialog-max-width-to-100vw
        height: '100vh'
      }
    )
    dialogRef.componentInstance.conversation = conversation
  }

}
