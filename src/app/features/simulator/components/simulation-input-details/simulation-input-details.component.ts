import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TrustFallbacks} from "@app/features/simulator/trust-fallbacks";
import {NgForOf} from "@angular/common";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {TrustSliderComponent} from "@app/shared/trust-slider/trust-slider.component";

@Component({
    selector: 'simulation-input-details',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    TrustSliderComponent,
  ],
    templateUrl: './simulation-input-details.component.html',
    styleUrl: './simulation-input-details.component.css'
})
export class SimulationInputDetails implements OnInit {

  @Input() simulationInputs!: TrustFallbacks
  @Output() recomputeWith: EventEmitter<TrustFallbacks> = new EventEmitter<TrustFallbacks>();
  partnerList: ConversationPartner[] = []
  valueList: (number|undefined)[] = []

  constructor() {}

  ngOnInit() {
    let [cps, numbers] = this.simulationInputs.getDisplayableArraysOfCps()
    this.partnerList = cps
    this.valueList = numbers
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
    this.valueList[i] = val;
    this.simulationInputs.setCp(cp, val)
    this.recomputeWith.emit(this.simulationInputs)
  }

  protected readonly SimulationInputs = TrustFallbacks;
}
