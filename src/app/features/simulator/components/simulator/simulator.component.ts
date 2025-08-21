import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatDialogRef} from "@angular/material/dialog";
import {Conversation} from "@app/shared/keml/core/conversation";
import {AuthorComponent} from "@app/shared/keml/graphical/author/author.component";
import {ConversationPartnerComponent} from "@app/shared/keml/graphical/cp/conversation-partner.component";
import {MsgComponent} from "@app/shared/keml/graphical/msg/msg.component";
import {PreknowledgeComponent} from "@app/shared/keml/graphical/preknowledge/preknowledge.component";
import {TextAreaSvgComponent} from "ngx-svg-graphics";
import {SimulationDialogueService} from "../../services/simulation-dialogue.service";
import {MatToolbar} from "@angular/material/toolbar";
import {TrustComputationService} from "../../services/trust-computation.service";
import {SimulationInputs} from "@app/features/simulator/simulation-inputs";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {IncrementalSimulationService} from "@app/features/simulator/services/incremental-simulation.service";
import {ArrowMarkersComponent} from "@app/shared/keml/graphical/helper/arrow-styling/arrow-markers/arrow-markers.component";
import {AlertService} from "ngx-emfular-helper";
import {
  SimulationInputDetails
} from "@app/features/simulator/components/simulation-input-details/simulation-input-details.component";

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
    ArrowMarkersComponent,
    SimulationInputDetails
  ],
  providers: [IncrementalSimulationService],
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
  showIncremental: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SimulatorComponent>,
    public simulationDialogueService: SimulationDialogueService,
    private alertService: AlertService,
    public incrementalSimulationService: IncrementalSimulationService,
    private trustComputationService: TrustComputationService,
  ) {}

  ngOnInit() {
    this.conversation.conversationPartners.forEach(cp => {
      this.simulationInputs.defaultsPerCp.set(cp, undefined)
    })
    try {
      this.trustComputationService.computeCurrentTrusts(this.conversation, this.simulationInputs)
    } catch (e) {
      if ((e instanceof Error)) {
        this.alertService.alert(e.message)
      }
    }
  }

  recompute(_: SimulationInputs) {
    this.trustComputationService.computeCurrentTrusts(this.conversation, this.simulationInputs)
  }

  close() {
    this.dialogRef.close();
  }

  simulateIncrementally() {
    this.showIncremental = true;
    this.incrementalSimulationService.simulate(this.simulationInputs, this.conversation)
      .then(() => {
        this.trustComputationService.computeCurrentTrusts(this.conversation, this.simulationInputs);
        this.showIncremental = false;
      })
  }

  pauseAndResume(): void {
    this.incrementalSimulationService.pauseAndResume()
  }

}
