import {Conversation} from "@app/shared/keml/core/conversation";
import {Information, InformationLink, NewInformation, Preknowledge, ReceiveMessage} from "@app/shared/keml/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";
import {TrustFallbacks} from "@app/features/simulator/trust-computation/trust-fallbacks";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {AlertService} from "ngx-emfular-helper";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TrustComputationService {

  constructor(private alertService: AlertService) {}

  computeCurrentTrusts(conv: Conversation, simulationInputs: TrustFallbacks) {
    let pres: Preknowledge[] = conv.author.preknowledge
    let receives = conv.author.messages.filter(m => !m.isSend())
      .map(m => m as ReceiveMessage)
    let newInfos: NewInformation[] = receives.flatMap(m => m.generates)
    this.computeCTFromKnowledge(pres, newInfos, receives.length, simulationInputs)
  }

  computeCTFromKnowledge(
    pres: Preknowledge[], newInfos: NewInformation[], recSize: number, simulationInputs: TrustFallbacks
  ): void {
    let toVisit: Information[] = newInfos
    toVisit.push(...pres)

    toVisit.forEach(info => info.currentTrust = undefined)

    while(toVisit.length > 0) {
      let remaining = toVisit.length

      for(let i = 0; i<toVisit.length; i++) {
        let info = toVisit[i]
        let res = this.computeTrust(info, recSize, simulationInputs)
        if (res != undefined) {
          info.currentTrust = res
          toVisit.splice(i, 1)
        }
      }
      // abort if no info was eliminated on a pass:
      if (remaining == toVisit.length) {
        let msg = 'Endless loops of '+ toVisit.length +' nodes - please check the InformationLinks' //todo highlight graphically?
        this.alertService.alert(msg)
        throw new Error(msg)
      }
    }
  }

  computeTrust(info: Information, recSize: number, simulationInputs: TrustFallbacks): number | undefined {
    let argScore = this.computeArgumentationScore(info)
    if (argScore != undefined) {
      let initial = this.determineInitialTrustForInfo(info, simulationInputs)
      return this.truncTo1(
        initial +
        this.computeRepetitionScore(info, recSize) +
        simulationInputs.weight*argScore
      )
    }
    return undefined
  }

  determineInitialTrustForInfo(info: Information, simulationInputs: TrustFallbacks): number {
    if (info.initialTrust != undefined) {
      return info.initialTrust
    }
    let newInfo = info as NewInformation
    if (newInfo.source) {
      let src: ConversationPartner = newInfo.source.counterPart
      return simulationInputs.getCpOrDefault(src)
    } else {
      return simulationInputs.preknowledgeDefault
    }
  }

  private truncTo1(score: number): number {
    if(score <-1) return -1
    if (score>1) return 1
    return score
  }

  computeRepetitionScore(info: Information, recSize: number): number {
    if(!recSize)
      return 0;
    else
      return info.repeatedBy.length/recSize
  }

  computeArgumentationScore(info: Information): number | undefined {
    let scores: (number | undefined)[] = info.targetedBy.map(link => this.score(link))
    if(scores.length == 0)
      return 0
    if (scores.filter(x => x == undefined).length >0) {
      return undefined
    }
    let res = 0
    scores.map(sc => { res += sc!})
    return res
  }

  score(link: InformationLink): number | undefined {
    if (link.source.currentTrust == undefined) {
      return undefined
    }
    return link.source.currentTrust*this.factorFromLinkType(link.type)
  }

  private factorFromLinkType(linkType: InformationLinkType): number {
    switch (linkType) {
      case InformationLinkType.SUPPLEMENT:
        return 0;
      case InformationLinkType.SUPPORT:
        return 0.5;
      case InformationLinkType.STRONG_SUPPORT:
        return 1;
      case InformationLinkType.STRONG_ATTACK:
        return -1;
      case InformationLinkType.ATTACK:
        return -0.5
    }
  }
}
