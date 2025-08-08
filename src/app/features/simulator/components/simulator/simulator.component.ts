import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatDialogRef} from "@angular/material/dialog";
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {AuthorComponent} from "@app/shared/keml/components/author/author.component";
import {ConversationPartnerComponent} from "@app/shared/keml/components/cp/conversation-partner.component";
import {MsgComponent} from "@app/shared/keml/components/msg/msg.component";
import {PreknowledgeComponent} from "@app/shared/keml/components/preknowledge/preknowledge.component";
import {TextAreaSvgComponent} from "ngx-svg-graphics";
import {SimulationDialogueService} from "../../services/simulation-dialogue.service";
import {MatToolbar} from "@angular/material/toolbar";
import {TrustComputator} from "../../utils/trust-computator";
import {SimulationInputs} from "@app/features/simulator/models/simulation-inputs";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {IncrementalSimulationService} from "@app/features/simulator/utils/incremental-simulation.service";
import {ArrowMarkersComponent} from "@app/shared/keml/components/helper/arrow-markers/arrow-markers.component";
import {AlertService} from "@app/core/services/alert.service";

@Component({
    selector: 'app-simulator',
    imports: [
        MatIcon,
        AuthorComponent,
        ConversationPartnerComponent,
        MsgComponent,
        NgForOf,
        PreknowledgeComponent,
        TextAreaSvgComponent,
        MatToolbar,
        NgTemplateOutlet,
        NgIf,
        ArrowMarkersComponent
    ],
    templateUrl: './simulator.component.html',
    styleUrl: './simulator.component.css'
})
export class SimulatorComponent implements OnInit {

  @Input() conversation!: Conversation
  simulationInputs: SimulationInputs = {
    weight: undefined,
    preknowledgeDefault: undefined,
    defaultsPerCp: new Map<ConversationPartner, number|undefined>()
  };
  incrementalSimulator?: IncrementalSimulationService

  constructor(
    public dialogRef: MatDialogRef<SimulatorComponent>,
    public simulationService: SimulationDialogueService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.conversation.conversationPartners.forEach(cp => {
      this.simulationInputs.defaultsPerCp.set(cp, undefined)
    })
    try {
      TrustComputator.computeCurrentTrusts(this.conversation, this.simulationInputs)
    } catch (e) {
      if ((e instanceof Error)) {
        this.alertService.alert(e.message)
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  manageSimulationInputs() {
    this.simulationService.openSimulationInputDetails(this.conversation, this.simulationInputs)
  }

  simulateIncrementally() {
    this.incrementalSimulator = new IncrementalSimulationService()
    this.incrementalSimulator.simulate(this.simulationInputs, this.conversation)
      .then(() => {
        TrustComputator.computeCurrentTrusts(this.conversation, this.simulationInputs);
        this.incrementalSimulator = undefined;
      })
  }

}
