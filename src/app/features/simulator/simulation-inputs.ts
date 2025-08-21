import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

export class SimulationInputs {
  static weightDefault: number = 2;
  static preknowledgeDefault: number = 1.0
  static generalDefault: number = 0.5

  _weight: number = 0;
  get weight() {
    return this._weight;
  }
  set weight(weight: number|undefined) {
    this._weight = weight? weight: SimulationInputs.weightDefault;
  }
  _preknowledgeDefault: number = 0;
  get preknowledgeDefault() {
    return this._preknowledgeDefault;
  }
  set preknowledgeDefault(preknowledgeDefault: number|undefined) {
    this._preknowledgeDefault = preknowledgeDefault? preknowledgeDefault: SimulationInputs.preknowledgeDefault;
  }
  defaultsPerCp: Map<ConversationPartner, number> = new Map();

  constructor(weight?: number, preknowledgeDefault?: number, defaultsPerCp?: Map<ConversationPartner, number|undefined>) {
    this.weight = weight? weight : SimulationInputs.weightDefault;
    this.preknowledgeDefault = preknowledgeDefault? preknowledgeDefault: SimulationInputs.preknowledgeDefault;
    defaultsPerCp?.forEach((v, cp) =>
      this.defaultsPerCp.set(cp, v? v: SimulationInputs.generalDefault)
    );
  }

  addCps(cps: ConversationPartner[]) {
    cps.forEach(cp => {
      this.defaultsPerCp.set(cp, SimulationInputs.generalDefault)
    })
  }

  setCp(cp: ConversationPartner, value: number|undefined) {
    this.defaultsPerCp.set(cp, value? value: SimulationInputs.generalDefault);
  }
}
