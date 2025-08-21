import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

export class TrustFallbacks {
  static weightDefault: number = 2;
  static preknowledgeDefault: number = 1.0
  static generalDefault: number = 0.5

  private _weight: number = 0;
  get weight(): number {
    return this._weight;
  }
  set weight(weight: number|undefined) {
    this._weight = weight? weight: TrustFallbacks.weightDefault;
  }
  private _preknowledgeDefault: number = 0;
  get preknowledgeDefault(): number {
    return this._preknowledgeDefault;
  }
  set preknowledgeDefault(preknowledgeDefault: number|undefined) {
    this._preknowledgeDefault = preknowledgeDefault? preknowledgeDefault: TrustFallbacks.preknowledgeDefault;
  }
  private defaultsPerCp: Map<ConversationPartner, number> = new Map();

  constructor(weight?: number, preknowledgeDefault?: number, defaultsPerCp?: Map<ConversationPartner, number|undefined>) {
    this.weight = weight? weight : TrustFallbacks.weightDefault;
    this.preknowledgeDefault = preknowledgeDefault? preknowledgeDefault: TrustFallbacks.preknowledgeDefault;
    defaultsPerCp?.forEach((v, cp) =>
      this.defaultsPerCp.set(cp, v? v: TrustFallbacks.generalDefault)
    );
  }

  addCps(cps: ConversationPartner[]) {
    cps.forEach(cp => {
      this.defaultsPerCp.set(cp, TrustFallbacks.generalDefault)
    })
  }

  setCp(cp: ConversationPartner, value: number|undefined) {
    this.defaultsPerCp.set(cp, value? value: TrustFallbacks.generalDefault);
  }

  getCpOrDefault(cp: ConversationPartner): number {
    let res = this.defaultsPerCp.get(cp);
    return res? res: TrustFallbacks.generalDefault;
  }

  getDisplayableArraysOfCps(): [ConversationPartner[], number[]] {
    return (
      [Array.from(this.defaultsPerCp.keys()),
      Array.from(this.defaultsPerCp.values())]
    )
  }
}
