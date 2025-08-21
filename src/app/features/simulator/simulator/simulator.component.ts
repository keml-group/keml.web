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
import {MatToolbar} from "@angular/material/toolbar";
import {TrustComputationService} from "../trust-computation.service";
import {TrustFallbacks} from "@app/features/simulator/trust-fallbacks";
import {IncrementalSimulationService} from "@app/features/simulator/incremental-simulation.service";
import {ArrowMarkersComponent} from "@app/shared/keml/graphical/helper/arrow-styling/arrow-markers/arrow-markers.component";
import {AlertService} from "ngx-emfular-helper";
import {
  TrustFallbackControls
} from "@app/features/simulator/trust-fallback-controls/trust-fallback-controls.component";
import {InfoTrustDetailsService} from "@app/features/simulator/info-trust-details.service";

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
    TrustFallbackControls,
    TrustFallbackControls
  ],
  providers: [IncrementalSimulationService],
    templateUrl: './simulator.component.html',
    styleUrl: './simulator.component.css'
})
export class SimulatorComponent implements OnInit {

  @Input() conversation!: Conversation
  trustFallbacks: TrustFallbacks = new TrustFallbacks()
  showIncremental: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SimulatorComponent>,
    public infoTrustDetailsService: InfoTrustDetailsService,
    private alertService: AlertService,
    public incrementalSimulationService: IncrementalSimulationService,
    private trustComputationService: TrustComputationService,
  ) {}

  ngOnInit() {
    this.trustFallbacks.addCps(this.conversation.conversationPartners)
    try {
      this.trustComputationService.computeCurrentTrusts(this.conversation, this.trustFallbacks)
    } catch (e) {
      if ((e instanceof Error)) {
        this.alertService.alert(e.message)
      }
    }
  }

  recompute(_: TrustFallbacks) {
    this.trustComputationService.computeCurrentTrusts(this.conversation, this.trustFallbacks)
  }

  close() {
    this.dialogRef.close();
  }

  simulateIncrementally() {
    this.showIncremental = true;
    this.incrementalSimulationService.simulate(this.trustFallbacks, this.conversation)
      .then(() => {
        this.trustComputationService.computeCurrentTrusts(this.conversation, this.trustFallbacks);
        this.showIncremental = false;
      })
  }

  pauseAndResume(): void {
    this.incrementalSimulationService.pauseAndResume()
  }

}
