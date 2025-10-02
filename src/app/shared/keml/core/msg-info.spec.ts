import {Information, InformationLink, NewInformation, Preknowledge, ReceiveMessage, SendMessage} from "./msg-info";
import {InformationLinkJson, InformationLinkType, NewInformationJson, PreknowledgeJson} from "@app/shared/keml/json/knowledge-models";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson, ReceiveMessageJson, SendMessageJson} from "@app/shared/keml/json/sequence-diagram-models";
import {RefHandler} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {JsonFixer} from "@app/shared/keml/json2core/json-fixer";
import {Conversation} from "@app/shared/keml/core/conversation";

describe("Msg-models", () => {
  it('should set a message counterpart correctly', () => {
    let cp0 = new ConversationPartner('cp0')
    let cp1 = new ConversationPartner('cp1')
    let rec = new ReceiveMessage(cp0, 1, 'msg')
    expect(rec.counterPart).toEqual(cp0)
    rec.counterPart = cp1
    expect(rec.counterPart).toEqual(cp1)
  })

  it('should serialize a send msg', () => {
    let cp = new ConversationPartner()
    let msg = new SendMessage(cp, 0, "sendContent")
    let msgJson: SendMessageJson = {
      eClass: EClasses.SendMessage,
      content: "sendContent",
      originalContent: undefined,
      timing: 0,
      counterPart: cp.getRef(),
      uses: []
    }
    expect(msg.toJson()).toEqual(msgJson);
  });

  it('should serialize a receive msg', () => {
    let cp = new ConversationPartner()
    let msg = new ReceiveMessage(cp, 1, "receiveContent")
    let msgJson: ReceiveMessageJson = {
      eClass: EClasses.ReceiveMessage,
      content: "receiveContent",
      originalContent: undefined,
      timing: 1,
      counterPart: cp.getRef(),
      isInterrupted: false,
      generates: [],
      repeats: []
    }
    expect(msg.toJson()).toEqual(msgJson);
  });

});

describe('Info (models)', () => {

  it('should prepare the information serialization for getRef', () => {
    let preknowledge = new Preknowledge()
     preknowledge.prepare('fantasy')
    expect (preknowledge.getRef()).toEqual(RefHandler.createRef('fantasy', EClasses.Preknowledge));
  })

  it('should determine the correct timing of a new info', () => {
    let cp = new ConversationPartner('cp')
    let rec = new ReceiveMessage(cp, 5)
    let newInfo = new NewInformation(rec, 'info1')
    expect(newInfo.getTiming()).toEqual(5)
    rec.timing = 0
    expect(newInfo.getTiming()).toEqual(0)
    //todo undefined is on the signature but only possible on current creation
  })

  it('should determine the correct timing of a preknowledge', () => {
    let pre0 = new Preknowledge('pre0')
    expect(pre0.getTiming()).toEqual(0)
    let cp = new ConversationPartner('cp')
    let send = new SendMessage(cp, 4)
    pre0.addIsUsedOn(send)
    expect(pre0.getTiming()).toEqual(4)
  })

  it('should determine if a repetition is allowed', () => {
    let cp = new ConversationPartner('cp')
    let rec = new ReceiveMessage(cp, 5)
    let newInfo = new NewInformation(rec, 'info1')
    let pre0 = new Preknowledge('pre0')
    let pre1 = new Preknowledge('pre1')
    let send3 = new SendMessage(cp, 3)
    pre0.addIsUsedOn(send3)
    expect(Information.isRepetitionAllowed(rec, newInfo)).toBe(false)
    expect(Information.isRepetitionAllowed(rec, pre1)).toBe(true)
    expect(Information.isRepetitionAllowed(rec, pre0)).toBe(true)
    rec.timing = 1
    expect(Information.isRepetitionAllowed(rec, pre0)).toBe(false)
    expect(Information.isRepetitionAllowed(rec, pre1)).toBe(true)
  })

  it('should serialize preknowledge', () => {
    let preknowledge = new Preknowledge()
    let preknowledgeJson : PreknowledgeJson = {
      causes: [],
      currentTrust: undefined,
      eClass: EClasses.Preknowledge,
      position: {x: 0, y: 0, w: 5, h: 5},
      feltTrustAfterwards: undefined,
      feltTrustImmediately: undefined,
      initialTrust: undefined,
      isInstruction: false,
      isUsedOn: [],
      message: "Preknowledge",
      repeatedBy: [],
      targetedBy: []
    }
    expect(preknowledge.toJson()).toEqual(preknowledgeJson);
  });

  it('should serialize newInfo', () => {
    let cp = new ConversationPartner()
    let msg = new ReceiveMessage(cp, 1, "receiveContent")
    let newInfo = new NewInformation(msg, 'New Info')
    let newInfoJson: NewInformationJson = {
      source: msg.getRef(),
      causes: [],
      currentTrust: undefined,
      eClass: EClasses.NewInformation,
      feltTrustAfterwards: undefined,
      feltTrustImmediately: undefined,
      initialTrust: undefined,
      isInstruction: false,
      isUsedOn: [],
      message: 'New Info',
      position: {x: 0, y: 0, w: 5, h: 5},
      repeatedBy: [],
      targetedBy: []
    }
    expect(newInfo.toJson()).toEqual(newInfoJson);
  });

  it('should serialize information links', () => {
    let cp = new ConversationPartner()
    let msg = new ReceiveMessage(cp, 1, "receiveContent")
    let newInfo1 = new NewInformation(msg, 'New Info1')
    let newInfo2 = new NewInformation(msg, 'New Info2')
    let preknowledge1 = new Preknowledge('Preknowledge1')
    let preknowledge2 = new Preknowledge('Preknowledge2')

    // ***** candidates **********
    let infoLink_new_new = new InformationLink(newInfo1, newInfo2, InformationLinkType.SUPPLEMENT, 'text')
    let infoLink_new_new_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      linkText: "text",
      source: RefHandler.createRef('', EClasses.NewInformation),
      target: RefHandler.createRef('', EClasses.NewInformation),
      type: InformationLinkType.SUPPLEMENT
    }
    expect(infoLink_new_new.toJson()).toEqual(infoLink_new_new_Json);

    let infoLink_new_pre = new InformationLink(newInfo1, preknowledge1, InformationLinkType.STRONG_ATTACK, 'text')
    let infoLink_new_pre_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      linkText: "text",
      source: RefHandler.createRef('', EClasses.NewInformation),
      target: RefHandler.createRef('', EClasses.Preknowledge),
      type: InformationLinkType.STRONG_ATTACK
    }
    expect(infoLink_new_pre.toJson()).toEqual(infoLink_new_pre_Json);

    let infoLink_pre_new = new InformationLink(preknowledge1, newInfo1, InformationLinkType.SUPPORT)
    let infoLink_pre_new_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      linkText: undefined,
      source: RefHandler.createRef('', EClasses.Preknowledge),
      target: RefHandler.createRef('', EClasses.NewInformation),
      type: InformationLinkType.SUPPORT
    }
    expect(infoLink_pre_new.toJson()).toEqual(infoLink_pre_new_Json);

    let infoLink_pre_pre = new InformationLink(preknowledge1, preknowledge2, InformationLinkType.STRONG_SUPPORT)
    let infoLink_pre_pre_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      linkText: undefined,
      source: RefHandler.createRef('', EClasses.Preknowledge),
      target: RefHandler.createRef('', EClasses.Preknowledge),
      type: InformationLinkType.STRONG_SUPPORT
    }
    expect(infoLink_pre_pre.toJson()).toEqual(infoLink_pre_pre_Json);

    let infoLink_pre_pre_2 = new InformationLink(preknowledge1, preknowledge2, InformationLinkType.ATTACK)
    let infoLink_pre_pre_2_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      linkText: undefined,
      source: RefHandler.createRef('', EClasses.Preknowledge),
      target: RefHandler.createRef('', EClasses.Preknowledge),
      type: InformationLinkType.ATTACK
    }
    expect(infoLink_pre_pre_2.toJson()).toEqual(infoLink_pre_pre_2_Json);
  });

  it('should delete an info link completely', () => {
    let p0 = new Preknowledge('p0')
    let p1 = new Preknowledge('p1')
    let link = new InformationLink(p1, p0, InformationLinkType.SUPPORT)

    expect(p0.targetedBy.length).toEqual(1)
    link.destruct()
    expect(p0.targetedBy.length).toEqual(0)
  })

  it('source destruction: should delete an info that is a link source for two links completely (also deletes the links)', () => {
    let p0 = new Preknowledge('p0')
    let p1 = new Preknowledge('p1')
    let p2 = new Preknowledge('p2')

    let link1 = new InformationLink( p0, p1, InformationLinkType.SUPPORT)
    let link2 = new InformationLink( p0, p2, InformationLinkType.SUPPLEMENT)
    expect(p0.causes.length).toEqual(2)
    expect(p1.targetedBy.length).toEqual(1)
    expect(p2.targetedBy.length).toEqual(1)

    p0.destruct()

    expect(p0.causes.length).toEqual(0)
    expect(p1.targetedBy.length).toEqual(0)
    expect(p2.targetedBy.length).toEqual(0)
  })

  it('target destruction: should delete an info that is a link target of two links completely (also deletes the links)', () => {
    let p0 = new Preknowledge('p0')
    let p1 = new Preknowledge('p1')
    let p2 = new Preknowledge('p2')
    let link1 = new InformationLink(p1, p0, InformationLinkType.SUPPORT)
    let link2 = new InformationLink(p2, p0, InformationLinkType.SUPPLEMENT)
    expect(p0.targetedBy.length).toEqual(2)
    expect(p1.causes.length).toEqual(1)
    expect(p2.causes.length).toEqual(1)

    p0.destruct()

    expect(p0.targetedBy.length).toEqual(0)
    expect(p1.causes.length).toEqual(0)
    expect(p2.causes.length).toEqual(0)
  })

  it('should time a preknowledge correctly', () => {
    let cp0 = new ConversationPartner()
    let m0 = new SendMessage( cp0, 0, 'm0')
    let m1 = new SendMessage( cp0, 2, 'm1')
    let m2 = new SendMessage( cp0, 5, 'm2')
    let m3 = new SendMessage( cp0, 6, 'm3')

    let pre0 = new Preknowledge('p0', false)
    let pre1 = new Preknowledge('p1', false)
    let pre2 = new Preknowledge('p2', false)
    let pre3 = new Preknowledge('p3', false)

    m1.uses.push(pre1)
    pre1.isUsedOn.push(m1)
    m0.uses.push(pre1)
    pre1.isUsedOn.push(m0)

    m2.uses.push(pre2)
    pre2.isUsedOn.push(m2)
    m1.uses.push(pre2)
    pre2.isUsedOn.push(m1)
    m3.uses.push(pre2)
    pre2.isUsedOn.push(m3)

    m3.uses.push(pre3)
    pre3.isUsedOn.push(m3)

    expect(pre0.getTiming()).toEqual(0)
    expect(pre1.getTiming()).toEqual(0)
    expect(pre2.getTiming()).toEqual(2)
    expect(pre3.getTiming()).toEqual(6)
  })
});

describe('deserialize and re-serialize real example', () => {

  it('should deserialize and re-serialize a real world example', () => {

    let json = require('@assets/test/3-2-keml-jackson.json');
    let convJson: ConversationJson = json as ConversationJson
    JsonFixer.prepareJsonInfoLinkSources(convJson);
    JsonFixer.addMissingSupplementType(convJson);
    let conv = Conversation.fromJSON(convJson)
    let convJson2 = conv.toJson()

    expect(convJson2).toEqual(convJson)
  })

});
