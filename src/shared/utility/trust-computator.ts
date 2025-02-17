import {Conversation} from "../models/keml/conversation";
import {Information, InformationLink, NewInformation, Preknowledge, ReceiveMessage} from "../models/keml/msg-info";
import {InformationLinkType} from "../models/keml/json/knowledge-models";
import {LifeLine} from "../models/keml/life-line";
import {Author} from "../models/keml/author";

export class TrustComputator {

  static generalDefault: number = 0.5
  static preknowledgeDefault: number = 1.0

  static computeCurrentTrusts(conv: Conversation, defaultsPerPartner?: Map<LifeLine, number>) {
    let pres: Preknowledge[] = conv.author.preknowledge
    let receives = conv.author.messages.filter(m => !m.isSend())
      .map(m => m as ReceiveMessage)
    let newInfos: NewInformation[] = receives.flatMap(m => m.generates)
    let defaults: Map<LifeLine, number> = this.determineDefaultsPerPartner(conv, defaultsPerPartner)
    this.computeCTFromKnowledge(pres, newInfos, receives.length, defaults, conv.author)
  }

  static determineDefaultsPerPartner(conv: Conversation, inputDefaults?: Map<LifeLine, number>): Map<LifeLine, number> {
    let length = conv.conversationPartners.length + 1 //author
    if (inputDefaults?.size == length) {
      return inputDefaults
    } else {
      let cps: LifeLine[] = conv.conversationPartners
      //cps.push(conv.author)
      let res = new Map()
      cps.map(ll => {
        let preVal: number | undefined = inputDefaults?.get(ll)
        res.set(ll, (preVal ? preVal: this.generalDefault ) )
      })
      res.set(conv.author, this.preknowledgeDefault)
      return res
    }
  }

  static computeCTFromKnowledge(pres: Preknowledge[], newInfos: NewInformation[], recSize: number, defaultsPerPartner: Map<LifeLine, number>, author: Author) {
    let toVisit: Information[] = newInfos
    toVisit.push(...pres)

    toVisit.forEach(info => info.currentTrust = undefined)

    while(toVisit.length > 0) {
      let remaining = toVisit.length

      for(let i = 0; i<toVisit.length; i++) {
        let info = toVisit[i]
        let res = this.computeTrust(info, recSize, defaultsPerPartner, author)
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

  static computeTrust(info: Information, recSize: number, defaultsPerPartner: Map<LifeLine, number>, author: Author): number | undefined {
    let argScore = this.computeArgumentationScore(info)
    if (argScore != undefined) {
      let initial = info.initialTrust ? info.initialTrust : this.determineInitialTrustForInfo(info, defaultsPerPartner, author)
      let res = initial +
        this.computeRepetitionScore(info, recSize) +
        2*argScore
      return this.truncTo1(res)
    }
    return undefined
  }

  static determineInitialTrustForInfo(info: Information, defaultsPerPartner: Map<LifeLine, number>, author: Author): number {
    let newInfo = info as NewInformation
    let src: LifeLine;
    if (newInfo.source) {
      src = newInfo.source.counterPart
    } else {
      src = author
    }
    let res = defaultsPerPartner.get(src)
    return res? res : this.generalDefault
  }

  static truncTo1(score: number): number {
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
