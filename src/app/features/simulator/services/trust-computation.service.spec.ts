import {TrustComputationService} from './trust-computation.service';
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {Information, InformationLink, NewInformation, Preknowledge, ReceiveMessage} from "@app/shared/keml/models/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {Author} from "@app/shared/keml/models/core/author";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";
import {ConversationJson} from "@app/shared/keml/models/json/sequence-diagram-models";
import {JsonFixer} from "@app/shared/keml/models/json2core/json-fixer";
import {SimulationInputs} from "@app/features/simulator/models/simulation-inputs";
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
    p0 = new Preknowledge('p0')
    p1 = new Preknowledge('p1')
    p2 = new Preknowledge('p2')
  })

  it('should compute the score of a single Link correctly', () => {
      let l0 = new InformationLink(p2, p0, InformationLinkType.STRONG_ATTACK)
      //let l1 = new InformationLink(p1, p0, InformationLinkType.SUPPORT)
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
      new InformationLink(p2, p0, InformationLinkType.ATTACK)
      new InformationLink(p1, p0, InformationLinkType.STRONG_SUPPORT)
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
    let r1 = new ReceiveMessage(cp, 1)
    let r2 = new ReceiveMessage(cp, 3)
    let info = new Preknowledge('info')
    expect(service.computeRepetitionScore(info, 0)).toEqual(0)
    expect(service.computeRepetitionScore(info, 1)).toEqual(0)
    info.repeatedBy.push(r1, r2)
    expect(service.computeRepetitionScore(info, 2)).toEqual(1)
    expect(service.computeRepetitionScore(info, 4)).toEqual(0.5)
  })

  it('should determineInitialTrustForInfo correctly', () => {
    let cp0 = new ConversationPartner('0')
    let cp1 = new ConversationPartner('1')
    let r1 = new ReceiveMessage(cp0, 1)
    let r2 = new ReceiveMessage(cp1, 2)
    let newInfo1 = new NewInformation(r1, 'm1')
    let newInfo2 = new NewInformation(r2, 'm2')
    let defByPartner = new Map<ConversationPartner, number>()
    let simInputs: SimulationInputs = {
      defaultsPerCp: defByPartner,
    }
    // no entries, hence real defaults should be used:
    expect(
      service.determineInitialTrustForInfo(p0, simInputs)
    ).toEqual(TrustComputationService.preknowledgeDefault) //1.0
    expect(
      service.determineInitialTrustForInfo(newInfo1, simInputs)
    ).toEqual(TrustComputationService.generalDefault) //0.5
    expect(
      service.determineInitialTrustForInfo(newInfo2, simInputs)
    ).toEqual(TrustComputationService.generalDefault) //0.5

    defByPartner.set(cp0, 0.1)
    defByPartner.set(cp1, 0.2)
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
    let defaults = new Map()
    let simInputs: SimulationInputs = {
      defaultsPerCp: defaults,
    }
    new InformationLink(p2, p0, InformationLinkType.STRONG_ATTACK)
    new InformationLink(p1, p0, InformationLinkType.SUPPORT)
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

    service.computeTrust(pre0, 2)
    // cannot use normal expect since actually, initial and current trust cannot be undefined
    expect(pre0.initialTrust == undefined).toEqual(true)
    expect(pre0.currentTrust == undefined).toEqual(true)
  })

  it('should throw an error when evaluating a cycle', () => {
    new InformationLink(p0, p1, InformationLinkType.SUPPORT)
    new InformationLink(p1, p0, InformationLinkType.STRONG_ATTACK)
    new InformationLink(p2, p1, InformationLinkType.STRONG_ATTACK)
    let auth = new Author('auth', 0, [p0, p1, p2])
    let conv = new Conversation('cycle', auth)
    expect(() => service.computeCurrentTrusts(conv)).toThrow(Error('Endless loops of 2 nodes - please check the InformationLinks'))
  })

  it('should adapt the current trusts', () => {
    let pre0 = new Preknowledge(
      'pre0', false, undefined,
      undefined, undefined,
      0.5, 0 )
    let pre1 = new Preknowledge('pre1',
      false, undefined, undefined, undefined,
      0.5, 0 )
    let pre2 = new Preknowledge('pre2',
      false, undefined, undefined, undefined,
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
      service.computeCurrentTrusts(conv)

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
    new InformationLink(info1, pre0, InformationLinkType.SUPPORT)
    new InformationLink(info2, pre2, InformationLinkType.STRONG_SUPPORT)

    expectations.set(pre2, 1)
    expectations.set(pre0, -0.5)
    verify()
  })

  it('should show that the case of 0 receives is handled correctly', () => {
    let conv = new Conversation()
    conv.author.preknowledge = [p0, p1]
    new InformationLink(p0, p1, InformationLinkType.ATTACK)
    service.computeCurrentTrusts(conv)
    expect(p0.currentTrust).toEqual(1.0)
    expect(p1.currentTrust).toEqual(0)
  } )

  it('should deal with real 3-2', () => {
    let json = '{\n' +
      '  "eClass" : "http://www.unikoblenz.de/keml#//Conversation",\n' +
      '  "title" : "3-2",\n' +
      '  "author" : {\n' +
      '    "messages" : [ {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "Find repositories that use log4j version 2.0 to 2.17.0 on GitHub",\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "Can you find for me public GitHub repositories that use log4j in Version 2.0 to 2.17.0?",\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//PreKnowledge",\n' +
      '        "$ref" : "//@author/@preknowledge.0"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "LLM cannot do, no real-time web access, Steps to find them, 1 search string",\n' +
      '      "timing" : 1,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "I\'m sorry, but as an AI language model, I don\'t have direct access to real-time data or the ability to browse the internet. Therefore, I can\'t search for specific repositories on GitHub at this moment.\\n\\nHowever, you can perform this search on GitHub by using their advanced search syntax. Here\'s an example query that you can use to find public repositories on GitHub that use Log4j version 2.0 to 2.17.0:\\n\\n```\\nlog4j version:2.0..2.17.0\\n```\\n\\nYou can go to the GitHub website (https://github.com/) and use the search bar at the top. Paste the above query into the search bar and press Enter. GitHub will display the repositories that match your search criteria.\\n\\nPlease note that the availability and search results may vary depending on when you perform the search.",\n' +
      '      "generates" : [ {\n' +
      '        "message" : "log4j version2.0...2.17.0",\n' +
      '        "isInstruction" : true,\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.1/@generates.1/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.7/@generates.1/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.3/@generates.0/@causes.0"\n' +
      '        } ],\n' +
      '        "isUsedOn" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '          "$ref" : "//@author/@messages.2"\n' +
      '        } ]\n' +
      '      }, {\n' +
      '        "message" : "Steps how to search  on GitHub as user",\n' +
      '        "isInstruction" : true,\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.17/@generates.1/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.5/@generates.0/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.9/@generates.0/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.11/@generates.1/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.11/@generates.0/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.19/@generates.0/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.23/@generates.0/@causes.0"\n' +
      '        } ],\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "search string",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.0"\n' +
      '          }\n' +
      '        } ],\n' +
      '        "isUsedOn" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '          "$ref" : "//@author/@messages.2"\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "execute search as described",\n' +
      '      "timing" : 2,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      },\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.1/@generates.0"\n' +
      '      }, {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.1/@generates.1"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "7 search results, not checked in depth",\n' +
      '      "timing" : 3,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      },\n' +
      '      "generates" : [ {\n' +
      '        "message" : "7 URLs of unknown repositories",\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.25/@generates.1/@causes.1"\n' +
      '        } ],\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "SUPPORT",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.0"\n' +
      '          }\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "also exclude 2.3.2, 2.12.4",\n' +
      '      "timing" : 4,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "Nice, this yielded 7 results. How about if I also want to exclude the versions 2.3.2 and 2.12.4",\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//PreKnowledge",\n' +
      '        "$ref" : "//@author/@preknowledge.1"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "1 adapted search string",\n' +
      '      "timing" : 5,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "To exclude specific versions like 2.3.2 and 2.12.4 from the search results, you can modify the GitHub search query as follows:\\n\\n```\\nlog4j version:2.0..2.17.0 -2.3.2 -2.12.4\\n```\\n\\nBy adding the `-2.3.2 -2.12.4` part to the query, you are excluding repositories that mention those specific versions of Log4j from the search results. This will refine your search further.\\n\\nAgain, you can go to the GitHub website (https://github.com/) and use the modified query in the search bar to retrieve the updated results.",\n' +
      '      "generates" : [ {\n' +
      '        "message" : "log4j version:2.0..2.17.0 -2.3.2 -2.12.4",\n' +
      '        "isInstruction" : true,\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.7/@generates.2/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.7/@generates.0/@causes.0"\n' +
      '        } ],\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.1"\n' +
      '          }\n' +
      '        } ],\n' +
      '        "isUsedOn" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '          "$ref" : "//@author/@messages.6"\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "use the latest search string, compare results with former",\n' +
      '      "timing" : 6,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      },\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.5/@generates.0"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "5 results, all from before, but most are empty repositories",\n' +
      '      "timing" : 7,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      },\n' +
      '      "generates" : [ {\n' +
      '        "message" : "most empty, none with gradle, none in right version",\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "STRONG_ATTACK",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.5/@generates.0"\n' +
      '          }\n' +
      '        } ],\n' +
      '        "isUsedOn" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '          "$ref" : "//@author/@messages.8"\n' +
      '        } ]\n' +
      '      }, {\n' +
      '        "message" : "most empty, none with gradle, one in 2.17.0 version",\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "STRONG_ATTACK",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.0"\n' +
      '          }\n' +
      '        } ]\n' +
      '      }, {\n' +
      '        "message" : "5 URLs of unknown repositories",\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.25/@generates.1/@causes.0"\n' +
      '        } ],\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "SUPPORT",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.5/@generates.0"\n' +
      '          }\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "Most results are inappropriate",\n' +
      '      "timing" : 8,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "I just checked the results: most of the repositories were empty but I could see the term on the short description in the search - but there was literally nothing in the repo. some others mentioned log4j Version 2.0 in their readme - so this is not working as expected - any suggestions?",\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.7/@generates.0"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "Limit search to specific files (*.java), 1 search string",\n' +
      '      "timing" : 9,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "I apologize for the inconvenience you experienced with the previous search query. While GitHub\'s search functionality can be helpful, it\'s possible that some repositories may not have updated their descriptions or README files to accurately reflect the presence of Log4j version 2.0 to 2.17.0.\\n\\nTo ensure more accurate results, you can try using a combination of search keywords along with the file path to narrow down the search to specific files where Log4j configuration or usage is more likely to be found.\\n\\nHere\'s an example query that focuses on Java files within the repository:\\n\\n```\\nlog4j filename:*.java\\n```\\n\\nThis query instructs GitHub to search for the term \\"log4j\\" specifically within Java files in the repository. You can further refine the query by adding specific keywords related to Log4j or your specific use case.\\n\\nRemember that GitHub\'s search results may not always be comprehensive or up-to-date, as they depend on the information provided by repository owners. Additionally, some repositories may be private or have limited access, which can affect search results.\\n\\nIf you require more accurate results or a comprehensive search, you may consider exploring alternative approaches, such as using other code search platforms or APIs specifically designed for code search.",\n' +
      '      "generates" : [ {\n' +
      '        "message" : "log4j filename:*.java",\n' +
      '        "isInstruction" : true,\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.11/@generates.2/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@preknowledge.2/@causes.0"\n' +
      '        } ],\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.1"\n' +
      '          }\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "Why *.java? dependencies not there",\n' +
      '      "timing" : 10,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "But do you really expect to find dependencies in the .java files?",\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//PreKnowledge",\n' +
      '        "$ref" : "//@author/@preknowledge.2"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "true, dependencies are in build files, two respective queries",\n' +
      '      "timing" : 11,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "You\'re right; finding direct references to dependencies like Log4j in Java files might not be the most reliable approach, as dependencies are typically managed in build configuration files rather than directly in the source code.\\n\\nTo search for repositories that use Log4j as a dependency, it\'s more effective to search for the presence of build configuration files like `pom.xml` for Maven projects or `build.gradle` for Gradle projects. These files typically specify the dependencies used by the project.\\n\\nHere\'s an example query to search for repositories with Log4j as a Maven dependency:\\n\\n```\\nlog4j filename:pom.xml\\n```\\n\\nSimilarly, you can modify the query for Gradle projects by searching for `build.gradle` files instead:\\n\\n```\\nlog4j filename:build.gradle\\n```\\n\\nThese queries will help you find repositories that include Log4j as a dependency in their respective build configurations. Again, please note that the availability and search results may vary depending on when you perform the search.",\n' +
      '      "generates" : [ {\n' +
      '        "message" : "log4j filename:build.gradle",\n' +
      '        "isInstruction" : true,\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.15/@generates.1/@causes.0"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.15/@generates.0/@causes.0"\n' +
      '        } ],\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.1"\n' +
      '          }\n' +
      '        } ],\n' +
      '        "isUsedOn" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '          "$ref" : "//@author/@messages.14"\n' +
      '        } ]\n' +
      '      }, {\n' +
      '        "message" : "log4j filename:pom.xml",\n' +
      '        "isInstruction" : true,\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.1"\n' +
      '          }\n' +
      '        } ]\n' +
      '      }, {\n' +
      '        "message" : "dependecies are in build files",\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "STRONG_ATTACK",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.9/@generates.0"\n' +
      '          }\n' +
      '        }, {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "STRONG_SUPPORT",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//PreKnowledge",\n' +
      '            "$ref" : "//@author/@preknowledge.2"\n' +
      '          }\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "Which files searched before?",\n' +
      '      "timing" : 12,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "So which files have been considered when I used \\"log4j version:2.0..2.17.0 -2.3.2 -2.12.4\\n\\""\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "various files, depends on GitHub",\n' +
      '      "timing" : 13,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "When you used the query \\"log4j version:2.0..2.17.0 -2.3.2 -2.12.4\\" on GitHub, the search results would have considered various files within the repositories. However, the exact files that were considered and indexed by GitHub\'s search functionality are not explicitly specified.\\n\\nGitHub\'s search engine typically indexes the repository\'s metadata, including the repository name, description, and README files. It may also index code files, such as Java files, depending on various factors. However, it\'s important to note that not all files within a repository are indexed, and the specific indexing behavior is managed by GitHub.\\n\\nWhen you perform a search on GitHub, the search results are based on the indexed information that GitHub has available at the time of the search. If the search results did not meet your expectations or if the repositories appeared empty or lacking the desired information, it is possible that the indexed information was incomplete or not accurately reflecting the actual content of the repositories.\\n\\nTo gather more accurate and comprehensive information about how Log4j is used in specific repositories, it may be necessary to manually inspect the repository\'s code, particularly the build configuration files such as `pom.xml` or `build.gradle`, as those files typically contain information about the dependencies, including the specific versions of Log4j used."\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "run gradle query",\n' +
      '      "timing" : 14,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      },\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.11/@generates.0"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "many results, mostly newer log4j versions",\n' +
      '      "timing" : 15,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      },\n' +
      '      "generates" : [ {\n' +
      '        "message" : "mostly too new log4j version",\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "STRONG_ATTACK",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.11/@generates.0"\n' +
      '          }\n' +
      '        } ],\n' +
      '        "isUsedOn" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '          "$ref" : "//@author/@messages.16"\n' +
      '        } ]\n' +
      '      }, {\n' +
      '        "message" : "~2k repositories",\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "too general",\n' +
      '          "type" : "ATTACK",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.11/@generates.0"\n' +
      '          }\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "gradle query delivers many results, mostly newer versions",\n' +
      '      "timing" : 16,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "I just tried \\"log4j filename:build.gradle\\" but it delivers lots of results that use log4j in a newer version than 2.17.0 - what is missing?",\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.15/@generates.0"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "GitHub search syntax has no way to specify version, manual steps to find version on specific repository",\n' +
      '      "timing" : 17,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "I apologize for the confusion earlier. It seems that the search query \\"log4j filename:build.gradle\\" alone is not sufficient to filter the results based on the specific Log4j version. The GitHub search syntax does not have built-in support for filtering based on the version of a specific dependency.\\n\\nTo refine the search and filter for repositories using Log4j in version 2.0 to 2.17.0 specifically, you would need to manually inspect the `build.gradle` files to verify the version of Log4j used in each repository.\\n\\nAlternatively, you could try using external code search platforms or code analysis tools that provide more advanced search capabilities and allow filtering based on specific dependency versions. Some popular tools for code search and analysis include Sourcegraph, searchcode, and Libraries.io.\\n\\nUsing these platforms, you can search for repositories that mention Log4j in their build files and then filter the results based on the specific version range you are interested in. However, please note that the availability and features of these platforms may vary, so it\'s important to explore and evaluate the options that best suit your needs.",\n' +
      '      "generates" : [ {\n' +
      '        "message" : "Short description how to inspect usage of library in one repository",\n' +
      '        "isInstruction" : true,\n' +
      '        "repeatedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '          "$ref" : "//@author/@messages.27"\n' +
      '        } ]\n' +
      '      }, {\n' +
      '        "message" : "GitHub search cannot search for library versions",\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.19/@generates.1/@causes.0"\n' +
      '        } ],\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "STRONG_ATTACK",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.1"\n' +
      '          }\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "no way to specify version?",\n' +
      '      "timing" : 18,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "So is there no way to specify a dependency evrsion in the search query?"\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "specifying versions on GitHub search possible, new search string",\n' +
      '      "timing" : 19,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "I apologize for the confusion caused by my previous responses. You can indeed specify a dependency version in the search query on GitHub. \\n\\nTo search for repositories on GitHub that use Log4j in version 2.0 to 2.17.0 specifically, you can use the following query:\\n\\n```\\nlog4j filename:build.gradle \\"2.0\\" \\"2.1\\" \\"2.2\\" \\"2.3\\" \\"2.4\\" \\"2.5\\" \\"2.6\\" \\"2.7\\" \\"2.8\\" \\"2.9\\" \\"2.10\\" \\"2.11\\" \\"2.12\\" \\"2.13\\" \\"2.14\\" \\"2.15\\" \\"2.16\\" \\"2.17\\"\\n```\\n\\nIn this query, we search for the term \\"log4j\\" specifically in `build.gradle` files, and then we specify each version as a separate search term enclosed in double quotes. This will help narrow down the search results to repositories that have a `build.gradle` file mentioning any of these Log4j versions.\\n\\nPlease note that this search query relies on the assumption that the repository\'s `build.gradle` file explicitly mentions the Log4j version being used. However, keep in mind that not all repositories may have this information explicitly specified in their build files.\\n\\nI apologize for any confusion caused by my previous responses, and I appreciate your patience.",\n' +
      '      "generates" : [ {\n' +
      '        "message" : "log4j filename:build.gradle \\"2.0\\" \\"2.1\\" \\"2.2\\" \\"2.3\\" \\"2.4\\" \\"2.5\\" \\"2.6\\" \\"2.7\\" \\"2.8\\" \\"2.9\\" \\"2.10\\"\\"2.11\\" \\"2.12\\" \\"2.13\\" \\"2.14\\" \\"2.15\\" \\"2.16\\" \\"2.17\\"",\n' +
      '        "isInstruction" : true,\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.21/@generates.0/@causes.0"\n' +
      '        } ],\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.1"\n' +
      '          }\n' +
      '        } ],\n' +
      '        "isUsedOn" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '          "$ref" : "//@author/@messages.20"\n' +
      '        } ]\n' +
      '      }, {\n' +
      '        "message" : "GitHub search can search for library versions",\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "STRONG_ATTACK",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.17/@generates.1"\n' +
      '          }\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "use latest search string",\n' +
      '      "timing" : 20,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      },\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.19/@generates.0"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "0 results",\n' +
      '      "timing" : 21,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      },\n' +
      '      "generates" : [ {\n' +
      '        "message" : "0 results, wrong query",\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "STRONG_ATTACK",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.19/@generates.0"\n' +
      '          }\n' +
      '        } ],\n' +
      '        "isUsedOn" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '          "$ref" : "//@author/@messages.22"\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "0 results, something wrong?",\n' +
      '      "timing" : 22,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "This yields 0 results, there seems to be something wrong with the query",\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.21/@generates.0"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "1 adapted search string",\n' +
      '      "timing" : 23,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "Apologies for the incorrect query in my previous response. It seems that specifying the versions individually in the search query is not yielding the desired results.\\n\\nTo search for repositories that use Log4j in the version range 2.0 to 2.17.0, you can try using the `..` range operator in the query. Here\'s the modified query:\\n\\n```\\nlog4j filename:build.gradle 2.0..2.17.0\\n```\\n\\nThis query instructs GitHub to search for the term \\"log4j\\" specifically in `build.gradle` files and filter the results to repositories that mention Log4j versions in the specified range.\\n\\nPlease note that GitHub\'s search functionality may have limitations, and it\'s possible that some repositories or specific files may not be indexed correctly or may not contain explicit version information in their `build.gradle` files. In such cases, manual inspection of the repositories or using alternative code search platforms may be necessary.",\n' +
      '      "generates" : [ {\n' +
      '        "message" : "log4j filename:build.gradle 2.0..2.17.0",\n' +
      '        "isInstruction" : true,\n' +
      '        "targetedBy" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.25/@generates.1/@causes.2"\n' +
      '        }, {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '          "$ref" : "//@author/@messages.25/@generates.0/@causes.0"\n' +
      '        } ],\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.1/@generates.1"\n' +
      '          }\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "run log4j filename:build.gradle 2.0..2.17.0, inspect results",\n' +
      '      "timing" : 24,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      }\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "12 results (7 from before), two with correct log4j versions",\n' +
      '      "timing" : 25,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.1"\n' +
      '      },\n' +
      '      "generates" : [ {\n' +
      '        "message" : "most empty, none with gradle, two in right versions",\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "STRONG_ATTACK",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.23/@generates.0"\n' +
      '          }\n' +
      '        } ]\n' +
      '      }, {\n' +
      '        "message" : "12 URLs of unknown repositories",\n' +
      '        "causes" : [ {\n' +
      '          "linkText" : "all from before and even more",\n' +
      '          "type" : "SUPPORT",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.7/@generates.2"\n' +
      '          }\n' +
      '        }, {\n' +
      '          "linkText" : "all from before and even more",\n' +
      '          "type" : "SUPPORT",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.3/@generates.0"\n' +
      '          }\n' +
      '        }, {\n' +
      '          "linkText" : "",\n' +
      '          "type" : "SUPPORT",\n' +
      '          "target" : {\n' +
      '            "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '            "$ref" : "//@author/@messages.23/@generates.0"\n' +
      '          }\n' +
      '        } ],\n' +
      '        "isUsedOn" : [ {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '          "$ref" : "//@author/@messages.26"\n' +
      '        } ]\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '      "content" : "12 results, none with gradle, but one in a correct version",\n' +
      '      "timing" : 26,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "Hm, I inspected all of them - the search gives the seven ones we had before plus 5 new ones. None of them uses gradle, but at least one uses log4j 2.17.0. Any idea why this is so often wrong?",\n' +
      '      "uses" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.25/@generates.1"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "eClass" : "http://www.unikoblenz.de/keml#//ReceiveMessage",\n' +
      '      "content" : "GitHub limited search features; manually inspect repositories, other sources",\n' +
      '      "timing" : 27,\n' +
      '      "counterPart" : {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//ConversationPartner",\n' +
      '        "$ref" : "//@conversationPartners.0"\n' +
      '      },\n' +
      '      "originalContent" : "I apologize for the continued issues you\'re experiencing with the search results. It\'s unfortunate that the search queries haven\'t been able to provide accurate results for repositories using the specified Log4j versions.\\n\\nGitHub\'s search functionality has its limitations, and it\'s possible that the search results may not always be up-to-date or comprehensive. Additionally, repositories may have different structures and configurations, making it challenging to accurately capture specific dependencies in a search query.\\n\\nIn cases where the search results are not reliable, it\'s recommended to explore alternative approaches. Some options you can consider include:\\n\\n1. Manually inspect repositories: If you have a specific set of repositories in mind or a specific project you\'re interested in, you can manually inspect the repositories\' code, particularly the build files (`build.gradle`, `pom.xml`, etc.), to determine the Log4j version being used.\\n\\n2. Utilize dependency management tools: Dependency management tools like Maven or Gradle have their own ways of resolving and managing dependencies. You can explore using these tools to analyze dependencies in specific projects.\\n\\n3. Check release notes or project documentation: Checking the release notes or documentation of projects or libraries can provide insights into the versions of Log4j they support or recommend.\\n\\n4. Engage with the community: If you\'re specifically interested in finding repositories that use Log4j in the desired version range, you can engage with relevant communities, forums, or discussion boards related to Log4j or the specific projects you\'re interested in. Seeking advice or recommendations from experts or contributors in those communities may help you identify repositories that align with your requirements.\\n\\nI apologize for the inconvenience caused by the limitations of the search functionality, and I hope these alternative approaches prove helpful in your search for repositories using Log4j in the specified version range.",\n' +
      '      "generates" : [ {\n' +
      '        "message" : "engage with community",\n' +
      '        "isInstruction" : true\n' +
      '      }, {\n' +
      '        "message" : "utilize dependency management tool",\n' +
      '        "isInstruction" : true\n' +
      '      } ],\n' +
      '      "repeats" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '        "$ref" : "//@author/@messages.17/@generates.0"\n' +
      '      } ]\n' +
      '    } ],\n' +
      '    "preknowledge" : [ {\n' +
      '      "message" : "log4j versions2.0-beta through 2.17.0 are vulnerable",\n' +
      '      "isUsedOn" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '        "$ref" : "//@author/@messages.0"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "message" : "security fixes are 2.3.2 and 2.12.4",\n' +
      '      "isUsedOn" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '        "$ref" : "//@author/@messages.4"\n' +
      '      } ]\n' +
      '    }, {\n' +
      '      "message" : "dependencies not in *.java",\n' +
      '      "targetedBy" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//InformationLink",\n' +
      '        "$ref" : "//@author/@messages.11/@generates.2/@causes.1"\n' +
      '      } ],\n' +
      '      "causes" : [ {\n' +
      '        "linkText" : "",\n' +
      '        "type" : "STRONG_ATTACK",\n' +
      '        "target" : {\n' +
      '          "eClass" : "http://www.unikoblenz.de/keml#//NewInformation",\n' +
      '          "$ref" : "//@author/@messages.9/@generates.0"\n' +
      '        }\n' +
      '      } ],\n' +
      '      "isUsedOn" : [ {\n' +
      '        "eClass" : "http://www.unikoblenz.de/keml#//SendMessage",\n' +
      '        "$ref" : "//@author/@messages.10"\n' +
      '      } ]\n' +
      '    } ]\n' +
      '  },\n' +
      '  "conversationPartners" : [ {\n' +
      '    "name" : "LLM"\n' +
      '  }, {\n' +
      '    "name" : "Browser"\n' +
      '  } ]\n' +
      '}'
    let convJson = JSON.parse(json)
    JsonFixer.prepareJsonInfoLinkSources(convJson);
    JsonFixer.addMissingSupplementType(convJson);
    let conv = Conversation.fromJSON(convJson)
    service.computeCurrentTrusts(conv)
    expect(conv.author.preknowledge[0].currentTrust).toEqual(1.0)
  })
});
