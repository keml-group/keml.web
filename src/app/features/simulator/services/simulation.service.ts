import { Injectable } from '@angular/core';
import {Information} from "@app/shared/keml/models/core/msg-info";
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {SimulatorComponent} from "@app/features/simulator/components/simulator/simulator.component";
import {MatDialog} from "@angular/material/dialog";
import {InfoTrustDetailsComponent} from "@app/features/simulator/components/info-trust-details/info-trust-details.component";
import {SimulationInputDetails} from "@app/features/simulator/components/simulation-input-details/simulation-input-details.component";
import {SimulationInputs} from "@app/features/simulator/models/simulation-inputs";
import {TrustComputator} from "@app/features/simulator/utils/trust-computator";

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

  openSimulationInputDetails(conversation: Conversation, simulationInputs: SimulationInputs) {
    const dialogRef = this.dialog.open(
      SimulationInputDetails,
      {
        width: '80vw',
        maxWidth: '100vw', //otherwise it is 80, see https://stackoverflow.com/questions/46034619/angular-material-2-how-to-overwrite-dialog-max-width-to-100vw
        height: '100vh'
      }
    )
    dialogRef.componentInstance.simulationInputs = simulationInputs
    dialogRef.componentInstance.recomputeWith.subscribe( sim =>  TrustComputator.computeCurrentTrusts(conversation, sim))
  }
}
