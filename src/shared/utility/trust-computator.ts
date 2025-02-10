import {Conversation} from "../models/keml/conversation";
import {Information, InformationLink, NewInformation, Preknowledge, ReceiveMessage} from "../models/keml/msg-info";
import {InformationLinkType} from "../models/keml/json/knowledge-models";

export class TrustComputator {

  static computeCurrentTrusts(conv: Conversation) {
    let pres: Preknowledge[] = conv.author.preknowledge
    let receives = conv.author.messages.filter(m => !m.isSend())
      .map(m =>m as ReceiveMessage)
    let newInfos: NewInformation[] = receives.flatMap(m => m.generates)

    this.computeCTFromKnowledge(pres, newInfos, receives.length)
  }

  static computeCTFromKnowledge(pres: Preknowledge[], newInfos: NewInformation[], recSize: number) {
    let toVisit: Information[] = newInfos
    toVisit.push(...pres)

    toVisit.forEach(info => info.currentTrust = 2) //todo use undefined

    while(toVisit.length > 0) {
      let remaining = toVisit.length

      for(let i = 0; i<toVisit.length; i++) {
        let info = toVisit[i]
        let res = this.computeTrust(info, recSize)
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

  static computeTrust(info: Information, recSize: number): number | undefined {
    let argScore = this.computeArgumentationScore(info)
    if (argScore != undefined) {
      let res = info.initialTrust +
        this.computeRepetitionScore(info, recSize) +
        2*argScore
      return this.truncTo1(res)
    }
    return undefined
  }

  static truncTo1(score: number): number {
    if(score <-1) return -1
    if (score>1) return 1
    return score
  }

  static computeRepetitionScore(info: Information, recSize: number): number {
    return info.repeatedBy.length/recSize
  }

  static computeArgumentationScore(info: Information): number | undefined {
    let scores = info.targetedBy.map(link => this.score(link))
    let res = 0
    scores.map(sc => {
      if (sc) {
        res += sc
      } else return undefined
    } )
    return res
  }

  static score(link: InformationLink): number | undefined {
    if (link.source.currentTrust == 2) { //todo use undefined once this is allowed
      return undefined
    }
    return link.source.currentTrust*this.factorFromLinkType(link.type)
  }

  static factorFromLinkType(linkType: InformationLinkType): number {
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
