import {TrustComputator} from './trust-computator';
import {Conversation} from "../models/keml/conversation";
import {Information, InformationLink, NewInformation, Preknowledge, ReceiveMessage} from "../models/keml/msg-info";
import {ConversationPartner} from "../models/keml/conversation-partner";
import {Author} from "../models/keml/author";
import {InformationLinkType} from "../models/keml/json/knowledge-models";

describe('TrustComputator', () => {
  it('should create an instance', () => {
    expect(new TrustComputator()).toBeTruthy();
  });

  let p0: Preknowledge;
  let p1: Preknowledge;
  let p2: Preknowledge;
  let recLength = 2;

  beforeEach(function () {
    p0 = new Preknowledge('p0')
    p1 = new Preknowledge('p1')
    p2 = new Preknowledge('p2')

    p0.currentTrust = 2
    p1.currentTrust = 2
    p2.currentTrust = 2
  })

  it('should compute the score of a single Link correctly', () => {
      let l0 = new InformationLink(p2, p0, InformationLinkType.STRONG_ATTACK)
      //let l1 = new InformationLink(p1, p0, InformationLinkType.SUPPORT)
      expect(TrustComputator.score(l0)).toEqual(undefined)
      p2.currentTrust = 0.5
      expect(TrustComputator.score(l0)).toEqual(-0.5)
      l0.type = InformationLinkType.SUPPORT
      expect(TrustComputator.score(l0)).toEqual(0.25)
      l0.type = InformationLinkType.SUPPLEMENT
      expect(TrustComputator.score(l0)).toEqual(0)
   }
  )

  it('should compute the argumentation score of a single node correctly', () => {
      new InformationLink(p2, p0, InformationLinkType.ATTACK)
      new InformationLink(p1, p0, InformationLinkType.STRONG_SUPPORT)
      expect(TrustComputator.computeArgumentationScore(p1)).toEqual(0)
      expect(TrustComputator.computeArgumentationScore(p2)).toEqual(0)
      expect(TrustComputator.computeArgumentationScore(p0)).toEqual(undefined)
      p1.currentTrust = 0.5
      expect(TrustComputator.computeArgumentationScore(p0)).toEqual(undefined)
      p2.currentTrust = 0.5
      expect(TrustComputator.computeArgumentationScore(p0)).toEqual(0.25)
    }
  )

  it('should evaluate a single node correctly', () => {
      new InformationLink(p2, p0, InformationLinkType.STRONG_ATTACK)
      new InformationLink(p1, p0, InformationLinkType.SUPPORT)
      expect(TrustComputator.computeTrust(p0, recLength)).toEqual(undefined)
      expect(TrustComputator.computeTrust(p1, recLength)).toEqual(0.5)
      expect(TrustComputator.computeTrust(p2, recLength)).toEqual(0.5)
      p1.currentTrust = 0.5 //+0.25
      p2.currentTrust = 0.4 //-0.4
      expect(TrustComputator.computeTrust(p0, recLength)).toBeCloseTo(0.2, 0.000001)
    // todo why is .toEqual(0.2) not possible? The numbers are easy, only negative sometimes
    }
  )

  it('should adapt the current trusts', () => {
    let pre0 = new Preknowledge('pre0',
      false, undefined, undefined, undefined, undefined, undefined,
      0.5, 0 )
    let pre1 = new Preknowledge('pre1',
      false, undefined, undefined, undefined, undefined, undefined,
      0.5, 0 )
    let pre2 = new Preknowledge('pre2',
      false, undefined, undefined, undefined, undefined, undefined,
      0.5, 0 )
    let pres = [pre0, pre1, pre2]

    let cp0 = new ConversationPartner('cp0')
    let cp1 = new ConversationPartner('cp1')
    let cps = [cp0, cp1]

    let rec0 = new ReceiveMessage(cp0, 0, 'm0')
    let rec1 = new ReceiveMessage(cp1, 1, 'm1')
    let rec2 = new ReceiveMessage(cp0, 2, 'm2')
    let rec3 = new ReceiveMessage(cp0, 3, 'm3')
    let msgs = [rec0, rec1, rec2, rec3]

    //todo add infos and Links

    let author = new Author('author', 0, pres, msgs)
    let conv = new Conversation('trusts', author, cps)

    function verify() {
      //call to test:
      TrustComputator.computeCurrentTrusts(conv)

      for (let [info, num] of expectations) {
        expect(info.currentTrust).toEqual(num)
      }
    }

    let expectations: Map<Information, number> = new Map<Information, number>()
    expectations.set(pre0, 0.5)
    expectations.set(pre1, 0.5)
    expectations.set(pre2, 0.5)

    verify()

    // **** next test: add repetitions
    function addRep(info: Information, msg: ReceiveMessage) {
      msg.repeats.push(info)
      info.repeatedBy.push(msg)
    }

    addRep(pre1, rec2)
    addRep(pre0, rec2)
    addRep(pre0, rec1)

    expectations.set(pre0, 1)
    expectations.set(pre1, 0.75)
    expectations.set(pre2, 0.5)

    verify()

    // add new infos:
    let info0 = new NewInformation(rec0, 'n0')
    let info1 = new NewInformation(rec0, 'n1')
    let info2 = new NewInformation(rec2, 'n2')
    let info3 = new NewInformation(rec3, 'n3')

    addRep(info0, rec1)
    addRep(info0, rec3)
    addRep(info2, rec3)

    expectations.set(info0, 1)
    expectations.set(info1, 0.5)
    expectations.set(info2, 0.75)
    expectations.set(info3, 0.5)
    verify()

    // add info links
    new InformationLink(pre2, pre0, InformationLinkType.STRONG_ATTACK)


    verify()

/*
    let json = conv.toJson()
    let jsonStr: string = JSON.stringify(json)
    expect(jsonStr).toEqual('')
    */

  })
});
