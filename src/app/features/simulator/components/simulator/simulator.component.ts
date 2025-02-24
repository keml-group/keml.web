import {Component, Input, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatDialogRef} from "@angular/material/dialog";
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {AuthorComponent} from "@app/shared/keml/components/author/author.component";
import {ConversationPartnerComponent} from "@app/shared/keml/components/cp/conversation-partner.component";
import {MsgComponent} from "@app/shared/keml/components/msg/msg.component";
import {PreknowledgeComponent} from "@app/shared/keml/components/preknowledge/preknowledge.component";
import {TextAreaSvgComponent} from "@app/core/features/svg-base-components/text-area-svg/text-area-svg.component";
import {SimulationService} from "../../services/simulation.service";
import {MatToolbar} from "@angular/material/toolbar";
import {TrustComputator} from "../../utils/trust-computator";
import {SimulationInputs} from "@app/features/simulator/models/simulation-inputs";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {IncrementalSimulator} from "@app/features/simulator/utils/incremental-simulator";

@Component({
  selector: 'app-simulator',
  standalone: true,
    imports: [
        MatIcon,
        AuthorComponent,
        ConversationPartnerComponent,
        MsgComponent,
        NgForOf,
        PreknowledgeComponent,
        TextAreaSvgComponent,
        MatToolbar
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

  constructor(
    public dialogRef: MatDialogRef<SimulatorComponent>,
    public simulationService: SimulationService,
  ) {}

  ngOnInit() {
    this.conversation.conversationPartners.forEach(cp => {
      this.simulationInputs.defaultsPerCp.set(cp, undefined)
    })
  }

  close() {
    this.dialogRef.close();
  }

  currentTrusts() {
    TrustComputator.computeCurrentTrusts(this.conversation, this.simulationInputs)
  }

  manageSimulationInputs() {
    this.simulationService.openSimulationInputDetails(this.simulationInputs)
  }

  simulateIncrementally() {
    console.log("simulateIncrementally");
    let simulation = new IncrementalSimulator(this.simulationInputs, this.conversation)
    this.conversation = simulation.incrementalConv
    simulation.simulate()
  }

}
