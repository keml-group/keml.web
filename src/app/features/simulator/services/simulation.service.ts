import { Injectable } from '@angular/core';
import {Information} from "@app/shared/keml/models/core/msg-info";
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {SimulatorComponent} from "@app/features/simulator/components/simulator/simulator.component";
import {MatDialog} from "@angular/material/dialog";
import {InfoTrustDetailsComponent} from "@app/features/simulator/components/info-trust-details/info-trust-details.component";

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

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

  openInfoTrusts(info: Information) {
    const dialogRef = this.dialog.open(
      InfoTrustDetailsComponent,
      {
        width: '80vw',
        maxWidth: '100vw', //otherwise it is 80, see https://stackoverflow.com/questions/46034619/angular-material-2-how-to-overwrite-dialog-max-width-to-100vw
        height: '100vh'
      }
    )
    dialogRef.componentInstance.info = info
  }
}
