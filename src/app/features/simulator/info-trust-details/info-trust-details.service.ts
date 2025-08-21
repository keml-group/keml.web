import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TrustComputationService} from "@app/features/simulator/trust-computation/trust-computation.service";
import {Information} from "@app/shared/keml/core/msg-info";
import {Conversation} from "@app/shared/keml/core/conversation";
import {TrustFallbacks} from "@app/features/simulator/trust-computation/trust-fallbacks";
import {InfoTrustDetailsComponent} from "@app/features/simulator/info-trust-details/info-trust-details/info-trust-details.component";

@Injectable({
  providedIn: 'root'
})
export class InfoTrustDetailsService {

  constructor(
    private dialog: MatDialog,
    private trustComputationService: TrustComputationService,
  ) { }

  openInfoTrusts(info: Information, conversation: Conversation, simulationInputs: TrustFallbacks) {
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

}
