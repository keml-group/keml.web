import { Injectable } from '@angular/core';
import {Information} from "@app/shared/keml/core/msg-info";
import {Conversation} from "@app/shared/keml/core/conversation";
import {SimulatorComponent} from "@app/features/simulator/components/simulator/simulator.component";
import {MatDialog} from "@angular/material/dialog";
import {InfoTrustDetailsComponent} from "@app/features/simulator/components/info-trust-details/info-trust-details.component";
import {SimulationInputDetails} from "@app/features/simulator/components/simulation-input-details/simulation-input-details.component";
import {SimulationInputs} from "@app/features/simulator/simulation-inputs";
import {TrustComputationService} from "@app/features/simulator/services/trust-computation.service";

@Injectable({
  providedIn: 'root'
})
export class SimulationDialogueService {

  constructor(
    private dialog: MatDialog,
    private trustComputationService: TrustComputationService,
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

  openInfoTrusts(info: Information, conversation: Conversation, simulationInputs: SimulationInputs) {
    const dialogRef = this.dialog.open(
      InfoTrustDetailsComponent,
      {
        width: '80vw',
        maxWidth: '100vw', //otherwise it is 80, see https://stackoverflow.com/questions/46034619/angular-material-2-how-to-overwrite-dialog-max-width-to-100vw
        height: '100vh'
      }
    )
    dialogRef.componentInstance.info = info
    dialogRef.componentInstance.infoChanged.subscribe(_ => {
      this.trustComputationService.computeCurrentTrusts(conversation, simulationInputs)
    })
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
    dialogRef.componentInstance.recomputeWith.subscribe( sim =>
      this.trustComputationService.computeCurrentTrusts(conversation, sim))
  }
}
