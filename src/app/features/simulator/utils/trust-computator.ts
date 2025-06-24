import {Conversation} from "@app/shared/keml/models/core/conversation";
import {Information, InformationLink, NewInformation, Preknowledge, ReceiveMessage} from "@app/shared/keml/models/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";
import {SimulationInputs} from "@app/features/simulator/models/simulation-inputs";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";

export class TrustComputator {

  static generalDefault: number = 0.5
  static preknowledgeDefault: number = 1.0
  static weightDefault: number = 2;

  static computeCurrentTrusts(conv: Conversation, simulationInputs?: SimulationInputs) {
    let pres: Preknowledge[] = conv.author.preknowledge
    let receives = conv.author.messages.filter(m => !m.isSend())
      .map(m => m as ReceiveMessage)
    let newInfos: NewInformation[] = receives.flatMap(m => m.generates)
    this.computeCTFromKnowledge(pres, newInfos, receives.length,
      simulationInputs
    )
  }

  static computeCTFromKnowledge(pres: Preknowledge[], newInfos: NewInformation[], recSize: number,
                                simulationInputs?: SimulationInputs,
                                ) {
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
        console.error(msg)
        throw(msg)
      }
    }
  }

  static computeTrust(info: Information, recSize: number, simulationInputs?: SimulationInputs): number | undefined {
    let argScore = this.computeArgumentationScore(info)
    if (argScore != undefined) {
      let initial = this.determineInitialTrustForInfo(info, simulationInputs)
      let weight = simulationInputs?.weight ? simulationInputs?.weight: this.weightDefault
      return this.truncTo1(
        initial +
        this.computeRepetitionScore(info, recSize) +
        weight*argScore
      )
    }
    return undefined
  }

  static determineInitialTrustForInfo(info: Information, simulationInputs?: SimulationInputs): number {
    if (info.initialTrust != undefined) {
      return info.initialTrust
    }
    let newInfo = info as NewInformation
    if (newInfo.source) {
      let src: ConversationPartner = newInfo.source.counterPart
      let res = simulationInputs?.defaultsPerCp?.get(src)
      return res? res : this.generalDefault
    } else {
      let res = simulationInputs?.preknowledgeDefault
      return res? res : this.preknowledgeDefault
    }
  }

  private static truncTo1(score: number): number {
    if(score <-1) return -1
    if (score>1) return 1
    return score
  }

  static computeRepetitionScore(info: Information, recSize: number): number {
    if(!recSize)
      return 0;
    else
      return info.repeatedBy.length/recSize
  }

  static computeArgumentationScore(info: Information): number | undefined {
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

  static score(link: InformationLink): number | undefined {
    if (link.source.currentTrust == undefined) {
      return undefined
    }
    return link.source.currentTrust*this.factorFromLinkType(link.type)
  }

  private static factorFromLinkType(linkType: InformationLinkType): number {
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
