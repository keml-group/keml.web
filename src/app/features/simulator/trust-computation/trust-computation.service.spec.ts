import {TrustComputationService} from './trust-computation.service';
import {Conversation} from "@app/shared/keml/core/conversation";
import {Information, InformationLink, NewInformation, Preknowledge, ReceiveMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {Author} from "@app/shared/keml/core/author";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {JsonFixer} from "@app/shared/keml/json2core/json-fixer";
import {TrustFallbacks} from "@app/features/simulator/trust-computation/trust-fallbacks";
import {TestBed} from "@angular/core/testing";

describe('TrustComputationService', () => {
  let service : TrustComputationService;

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TrustComputationService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  let p0: Preknowledge;
  let p1: Preknowledge;
  let p2: Preknowledge;
  let recLength = 2;

  beforeEach(function () {
    p0 = Preknowledge.create('p0')
    p1 = Preknowledge.create('p1')
    p2 = Preknowledge.create('p2')
  })

  it('should compute the score of a single Link correctly', () => {
      let l0 = InformationLink.create(p2, p0, InformationLinkType.STRONG_ATTACK)
    //let l1 = InformationLink.create(p1, p0, InformationLinkType.SUPPORT)
      expect(service.score(l0)).toEqual(undefined)
      p2.currentTrust = 0.5
      expect(service.score(l0)).toEqual(-0.5)
      l0.type = InformationLinkType.SUPPORT
      expect(service.score(l0)).toEqual(0.25)
      l0.type = InformationLinkType.SUPPLEMENT
      expect(service.score(l0)).toEqual(0)
   }
  )

  it('should compute the argumentation score of a single node correctly', () => {
      InformationLink.create(p2, p0, InformationLinkType.ATTACK)
    InformationLink.create(p1, p0, InformationLinkType.STRONG_SUPPORT)
    expect(service.computeArgumentationScore(p1)).toEqual(0)
      expect(service.computeArgumentationScore(p2)).toEqual(0)
      expect(service.computeArgumentationScore(p0)).toEqual(undefined)
      p1.currentTrust = 0.5
      expect(service.computeArgumentationScore(p0)).toEqual(undefined)
      p2.currentTrust = 0.5
      expect(service.computeArgumentationScore(p0)).toEqual(0.25)
    }
  )

  it('should compute the repetition score of a single node correctly', () => {
    let cp = new ConversationPartner('cp')
    let r1 = ReceiveMessage.create(cp, 1)
    let r2 = ReceiveMessage.create(cp, 3)
    let info = Preknowledge.create('info')
    expect(service.computeRepetitionScore(info, 0)).toEqual(0)
    expect(service.computeRepetitionScore(info, 1)).toEqual(0)
    info.repeatedBy.push(r1, r2)
    expect(service.computeRepetitionScore(info, 2)).toEqual(1)
    expect(service.computeRepetitionScore(info, 4)).toEqual(0.5)
  })

  it('should determineInitialTrustForInfo correctly', () => {
    let cp0 = new ConversationPartner('0')
    let cp1 = new ConversationPartner('1')
    let r1 = ReceiveMessage.create(cp0, 1)
    let r2 = ReceiveMessage.create(cp1, 2)
    let newInfo1 = NewInformation.create(r1, 'm1')
    let newInfo2 = NewInformation.create(r2, 'm2')
    let simInputs: TrustFallbacks = new TrustFallbacks()
    // no entries, hence real defaults should be used:
    expect(
      service.determineInitialTrustForInfo(p0, simInputs)
    ).toEqual(1.0)
    expect(
      service.determineInitialTrustForInfo(newInfo1, simInputs)
    ).toEqual(0.5)
    expect(
      service.determineInitialTrustForInfo(newInfo2, simInputs)
    ).toEqual(0.5)

    simInputs.setCp(cp0, 0.1)
    simInputs.setCp(cp1, 0.2)
    simInputs.preknowledgeDefault = 0.3
    expect(
      service.determineInitialTrustForInfo(p0, simInputs)
    ).toEqual(0.3)
    expect(
      service.determineInitialTrustForInfo(newInfo1, simInputs)
    ).toEqual(0.1)
    expect(
      service.determineInitialTrustForInfo(newInfo2, simInputs)
    ).toEqual(0.2)
    //now use initial trust:
    newInfo2.initialTrust = 0.8
    expect(
      service.determineInitialTrustForInfo(newInfo2, simInputs)
    ).toEqual(0.8)
  })

  it('should evaluate a single node correctly', () => {
    let simInputs: TrustFallbacks = new TrustFallbacks()
    InformationLink.create(p2, p0, InformationLinkType.STRONG_ATTACK)
    InformationLink.create(p1, p0, InformationLinkType.SUPPORT)
    expect(service.computeTrust(p0, recLength, simInputs)).toEqual(undefined)
    expect(service.computeTrust(p1, recLength, simInputs)).toEqual(1.0)
    expect(service.computeTrust(p2, recLength, simInputs)).toEqual(1.0)

    p1.currentTrust = 0.5 //on p0 +0.25 by Support
    p2.currentTrust = 0.4 //on p0 -0.4 by Strong Attack
    expect(service.computeTrust(p1, recLength, simInputs)).toEqual(1.0)
    expect(service.computeTrust(p2, recLength, simInputs)).toEqual(1.0)

    expect(service.computeArgumentationScore(p0)).toBeCloseTo(-0.15, 0.00000001)
    expect(service.computeRepetitionScore(p0, recLength)).toEqual(0)
    expect(p0.initialTrust).toEqual(undefined)
    expect(service.determineInitialTrustForInfo(p0, simInputs)).toEqual(1.0)

    // weight = 2
    expect(service.computeTrust(p0, recLength, simInputs)).toBeCloseTo(0.7, 0.000000001)
    simInputs.weight = 1
    expect(service.computeTrust(p0, recLength, simInputs)).toBeCloseTo(0.85, 0.000000001)
    simInputs.weight = 3
    expect(service.computeTrust(p0, recLength, simInputs)).toBeCloseTo(0.55, 0.000000001)
  })

  it('should return undefined on a node\'s trust computation if no initial trust exists on it', () => {
    //it('should throw an error on a node\'s trust computation if no initial trust exists on it', () => {
    //todo we need JSON to get a wrong preknowledge (one without initial trust) in
    let json = '{\n' +
      '  "eClass": "http://www.unikoblenz.de/keml#//Conversation",\n' +
      '  "title": "New Conversation",\n' +
      '  "conversationPartners": [],\n' +
      '  "author": {\n' +
      '    "eClass": "http://www.unikoblenz.de/keml#//Author",\n' +
      '    "name": "Author",\n' +
      '    "xPosition": 0,\n' +
      '    "messages": [],\n' +
      '    "preknowledge": [\n' +
      '      {\n' +
      '        "causes": [],\n' +
      '        "eClass": "http://www.unikoblenz.de/keml#//PreKnowledge",\n' +
      '        "isInstruction": false,\n' +
      '        "isUsedOn": [],\n' +
      '        "message": "p_no_init",\n' +
      '        "repeatedBy": [],\n' +
      '        "targetedBy": [],\n' +
      '        "position": {\n' +
      '          "x": -354,\n' +
      '          "y": 122,\n' +
      '          "w": 200,\n' +
      '          "h": 50\n' +
      '        }\n' +
      '      }\n' +
      '    ]\n' +
      '  }\n' +
      '}'
    let convJson =  <ConversationJson>JSON.parse(json);
    let conv = Conversation.fromJSON(convJson);
    // service.computeCurrentTrusts(conv)

    let pres = conv.author.preknowledge
    let pre0 = pres[0]

    service.computeTrust(pre0, 2, new TrustFallbacks())
    // cannot use normal expect since actually, initial and current trust cannot be undefined
    expect(pre0.initialTrust == undefined).toEqual(true)
    expect(pre0.currentTrust == undefined).toEqual(true)
  })

  it('should throw an error when evaluating a cycle', () => {
    InformationLink.create(p0, p1, InformationLinkType.SUPPORT)
    InformationLink.create(p1, p0, InformationLinkType.STRONG_ATTACK)
    InformationLink.create(p2, p1, InformationLinkType.STRONG_ATTACK)
    let conv = Conversation.create('cycle')
    conv.author.addPreknowledge(p0, p1, p2)
    expect(() => service.computeCurrentTrusts(conv, new TrustFallbacks())).toThrow(Error('Endless loops of 2 nodes - please check the InformationLinks'))
  })

  it('should adapt the current trusts', () => {
    let pre0 = Preknowledge.create('pre0', false, undefined, 0.5, 0)
    let pre1 = Preknowledge.create('pre1', false, undefined, 0.5, 0)
    let pre2 = Preknowledge.create('pre2', false, undefined, 0.5, 0)

    let cp0 = new ConversationPartner('cp0')
    let cp1 = new ConversationPartner('cp1')
    let cps = [cp0, cp1]

    let rec0 = ReceiveMessage.create(cp0, 0, 'm0')
    let rec1 = ReceiveMessage.create(cp1, 1, 'm1')
    let rec2 = ReceiveMessage.create(cp0, 2, 'm2')
    let rec3 = ReceiveMessage.create(cp0, 3, 'm3')

    //todo add infos and Links
    let conv = Conversation.create('trusts')
    conv.addCP(...cps)
    conv.author.addPreknowledge(pre0, pre1, pre2)
    conv.author.addMessage(rec0, rec1, rec2, rec3)

    function verify() {
      //call to test:
      service.computeCurrentTrusts(conv, new TrustFallbacks())

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
    let info0 = NewInformation.create(rec0, 'n0')
    let info1 = NewInformation.create(rec0, 'n1')
    let info2 = NewInformation.create(rec2, 'n2')
    let info3 = NewInformation.create(rec3, 'n3')

    addRep(info0, rec1)
    addRep(info0, rec3)
    addRep(info2, rec3)

    expectations.set(info0, 1)
    expectations.set(info1, 0.5)
    expectations.set(info2, 0.75)
    expectations.set(info3, 0.5)
    verify()

    // add info links
    InformationLink.create(pre2, pre0, InformationLinkType.STRONG_ATTACK)
    InformationLink.create(info1, pre0, InformationLinkType.SUPPORT)
    InformationLink.create(info2, pre2, InformationLinkType.STRONG_SUPPORT)

    expectations.set(pre2, 1)
    expectations.set(pre0, -0.5)
    verify()
  })

  it('should show that the case of 0 receives is handled correctly', () => {
    let conv = Conversation.create()
    conv.author.addPreknowledge(p0, p1)
    InformationLink.create(p0, p1, InformationLinkType.ATTACK)
    service.computeCurrentTrusts(conv, new TrustFallbacks())
    expect(p0.currentTrust).toEqual(1.0)
    expect(p1.currentTrust).toEqual(0)
  } )

  it('should deal with real 3-2', () => {
    let json = require('@assets/test/3-2-fromTrustComp.json')
    let convJson: ConversationJson = json as ConversationJson;
    JsonFixer.prepareJsonInfoLinkSources(convJson);
    let conv = Conversation.fromJSON(convJson)
    service.computeCurrentTrusts(conv, new TrustFallbacks())
    expect(conv.author.preknowledge[0].currentTrust).toEqual(1.0)
  })
});
