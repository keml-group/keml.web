import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SimulationInputs} from "@app/features/simulator/simulation-inputs";
import {NgForOf} from "@angular/common";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {TrustComputationService} from "@app/features/simulator/services/trust-computation.service";
import {TrustSliderComponent} from "@app/shared/trust-slider/trust-slider.component";

@Component({
    selector: 'simulation-input-details',
  imports: [
    MatIcon,
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    TrustSliderComponent,
  ],
    templateUrl: './simulation-input-details.component.html',
    styleUrl: './simulation-input-details.component.css'
})
export class SimulationInputDetails implements OnInit {

  @Input() simulationInputs!: SimulationInputs
  @Output() recomputeWith: EventEmitter<SimulationInputs> = new EventEmitter<SimulationInputs>();
  partnerList: ConversationPartner[] = []
  defaultList: (number|undefined)[] = []

  constructor(
    private dialogRef: MatDialogRef<SimulationInputDetails>,
  ) {}

  ngOnInit() {
    this.partnerList = Array.from(this.simulationInputs.defaultsPerCp.keys())
    this.defaultList = Array.from(this.simulationInputs.defaultsPerCp.values())
  }

  changeArgumentationWeight(val: (number| undefined)) {
    this.simulationInputs.weight = val
    this.recomputeWith.emit(this.simulationInputs)
  }

  changeDefaultForPre(val: (number| undefined)) {
    this.simulationInputs.preknowledgeDefault = val
    this.recomputeWith.emit(this.simulationInputs)
  }

  changeDefaultForCp(cp: ConversationPartner, i: number, val: (number| undefined)) {
    this.defaultList[i] = val;
    this.simulationInputs.defaultsPerCp.set(cp, val)
    this.recomputeWith.emit(this.simulationInputs)
  }

  closeMe() {
    this.dialogRef.close();
  }

  protected readonly TrustComputator = TrustComputationService;
}
