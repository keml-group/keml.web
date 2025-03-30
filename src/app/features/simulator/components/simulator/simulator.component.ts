import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
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
import {KEMLArrowStyleConfigurationService} from "@app/shared/keml/services/kemlarrow-style-configuration.service";
import {ArrowStyleConfigurationService} from "@app/core/features/arrows/services/arrow-style-configuration.service";

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
    MatToolbar,
    NgTemplateOutlet,
    NgIf
  ],
  providers: [
    {
        provide: ArrowStyleConfigurationService,
        useClass: KEMLArrowStyleConfigurationService
    },
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
  incrementalSimulator?: IncrementalSimulator

  constructor(
    public dialogRef: MatDialogRef<SimulatorComponent>,
    public simulationService: SimulationService,
  ) {}

  ngOnInit() {
    this.conversation.conversationPartners.forEach(cp => {
      this.simulationInputs.defaultsPerCp.set(cp, undefined)
    })
    TrustComputator.computeCurrentTrusts(this.conversation, this.simulationInputs)
  }

  close() {
    this.dialogRef.close();
  }

  manageSimulationInputs() {
    this.simulationService.openSimulationInputDetails(this.conversation, this.simulationInputs)
  }

  simulateIncrementally() {
    this.incrementalSimulator = new IncrementalSimulator(this.simulationInputs, this.conversation)
    this.incrementalSimulator.simulate()
      .then(() => {
        TrustComputator.computeCurrentTrusts(this.conversation, this.simulationInputs);
        this.incrementalSimulator = undefined;
      })
  }

}
