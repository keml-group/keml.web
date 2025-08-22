import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
import {TrustComputationService} from "../trust-computation/trust-computation.service";
import {TrustFallbacks} from "@app/features/simulator/trust-computation/trust-fallbacks";
import {IncrementalSimulationService} from "@app/features/simulator/incremental-simulation.service";
import {ArrowMarkersComponent} from "@app/shared/keml/graphical/helper/arrow-styling/arrow-markers/arrow-markers.component";
import {AlertService, IoService} from "ngx-emfular-helper";
import {
  TrustFallbackControls
} from "@app/features/simulator/trust-computation/trust-fallback-controls/trust-fallback-controls.component";
import {InfoTrustDetailsService} from "@app/features/simulator/info-trust-details/info-trust-details.service";

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

  @ViewChild("simulation") simulationSvg!: ElementRef<SVGElement>;

  constructor(
    public dialogRef: MatDialogRef<SimulatorComponent>,
    public infoTrustDetailsService: InfoTrustDetailsService,
    private alertService: AlertService,
    public incrementalSimulationService: IncrementalSimulationService,
    private trustComputationService: TrustComputationService,
    private ioService: IoService,
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

  saveSVG() {
    const svgContent = this.simulationSvg.nativeElement;
    if(svgContent) {
      this.ioService.saveSVG(svgContent, this.conversation.title)
    }
  }

  saveSVGasPNG() {
    const svgContent = this.simulationSvg.nativeElement;
    if(svgContent) {
      this.ioService.saveSvgAsPng(svgContent, this.conversation.title)
    }
  }

  saveSVGasJPEG() {
    const svgContent = this.simulationSvg.nativeElement;
    if(svgContent) {
      this.ioService.saveSvgAsJpeg(svgContent, this.conversation.title)
    }
  }
}
