import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TrustFallbacks} from "@app/features/simulator/trust-fallbacks";
import {NgForOf} from "@angular/common";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {TrustSliderComponent} from "@app/shared/trust-slider/trust-slider.component";

@Component({
    selector: 'trust-fallback-controls',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    TrustSliderComponent,
  ],
    templateUrl: './trust-fallback-controls.component.html',
    styleUrl: './trust-fallback-controls.component.css'
})
export class TrustFallbackControls implements OnInit {

  @Input() trustFallbacks!: TrustFallbacks
  @Output() trustFallbacksChange: EventEmitter<TrustFallbacks> = new EventEmitter<TrustFallbacks>();
  partnerList: ConversationPartner[] = []
  valueList: (number|undefined)[] = []

  constructor() {}

  ngOnInit() {
    let [cps, numbers] = this.trustFallbacks.getDisplayableArraysOfCps()
    this.partnerList = cps
    this.valueList = numbers
  }

  changeArgumentationWeight(val: (number| undefined)) {
    this.trustFallbacks.weight = val
    this.trustFallbacksChange.emit(this.trustFallbacks)
  }

  changeDefaultForPre(val: (number| undefined)) {
    this.trustFallbacks.preknowledgeDefault = val
    this.trustFallbacksChange.emit(this.trustFallbacks)
  }

  changeDefaultForCp(cp: ConversationPartner, i: number, val: (number| undefined)) {
    this.valueList[i] = val;
    this.trustFallbacks.setCp(cp, val)
    this.trustFallbacksChange.emit(this.trustFallbacks)
  }

  protected readonly SimulationInputs = TrustFallbacks;
}
