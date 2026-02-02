import {InformationLink, NewInformation, Preknowledge, ReceiveMessage, SendMessage} from "./msg-info";
import {InformationLinkJson, InformationLinkType, NewInformationJson, PreknowledgeJson} from "@app/shared/keml/json/knowledge-models";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson, ReceiveMessageJson, SendMessageJson} from "@app/shared/keml/json/sequence-diagram-models";
import {RefHandler, JsonComparer} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {JsonFixer} from "@app/shared/keml/json2core/json-fixer";
import {Conversation} from "@app/shared/keml/core/conversation";

describe("Msg-models", () => {
  it('should set a message counterpart correctly', () => {
    let cp0 = new ConversationPartner(undefined, 'cp0')
    let cp1 = new ConversationPartner(undefined, 'cp1')
    let rec = ReceiveMessage.create(cp0, 1, 'msg')
    expect(rec.counterPart).toEqual(cp0)
    rec.counterPart = cp1
    expect(rec.counterPart).toEqual(cp1)
  })

  it('should serialize a send msg', () => {
    let cp = new ConversationPartner()
    let msg = SendMessage.create(cp, 0, "sendContent")
    let msgJson: SendMessageJson = {
      eClass: EClasses.SendMessage,
      content: "sendContent",
      counterPart: cp.getRef(),
    }
    expect(msg.toJson()).toEqual(msgJson);
  });

  it('should serialize a receive msg', () => {
    let cp = new ConversationPartner()
    let msg = ReceiveMessage.create(cp, 1, "receiveContent")
    let msgJson: ReceiveMessageJson = {
      eClass: EClasses.ReceiveMessage,
      content: "receiveContent",
      timing: 1,
      counterPart: cp.getRef(),
    }
    expect(msg.toJson()).toEqual(msgJson);
    msg.timing = 0; //default
    msg.isInterrupted = true;
    let msgJson2 : ReceiveMessageJson = {
      eClass: EClasses.ReceiveMessage,
      content: "receiveContent",
      counterPart: cp.getRef(),
      isInterrupted: true,
    }
    expect(msg.toJson()).toEqual(msgJson2);
  });

});

describe('Info (models)', () => {

  it('should prepare the information serialization for getRef', () => {
    let preknowledge = Preknowledge.create()
     preknowledge.prepare('fantasy')
    expect (preknowledge.getRef()).toEqual(RefHandler.createRef('fantasy', EClasses.Preknowledge));
  })

  it('should determine the correct timing of a new info', () => {
    let rec = new ReceiveMessage(undefined, 5)
    let newInfo = NewInformation.create(rec, 'info1')
    expect(newInfo.getTiming()).toEqual(5)
    rec.timing = 0
    expect(newInfo.getTiming()).toEqual(0)
    //todo undefined is on the signature but only possible on current creation
  })

  it('should determine the correct timing of a preknowledge', () => {
    let pre0 = Preknowledge.create('pre0')
    expect(pre0.getTiming()).toEqual(0)
    let cp = ConversationPartner.create('cp')
    let send = SendMessage.create(cp, 4)
    pre0.addIsUsedOn(send)
    expect(pre0.getTiming()).toEqual(4)
    pre0.removeIsUsedOn(send)
    expect(pre0.getTiming()).toEqual(0)
  })

  it('should serialize preknowledge', () => {
    let preknowledge = Preknowledge.create()
    let preknowledgeJson : PreknowledgeJson = {
      eClass: EClasses.Preknowledge,
      position: {x: 0, y: 0, w: 5, h: 5},
      message: "Preknowledge",
    }
    expect(preknowledge.toJson()).toEqual(preknowledgeJson);
  });

  it('should serialize newInfo', () => {
    let msg = new ReceiveMessage(undefined, 1, "receiveContent")
    let newInfo = NewInformation.create(msg, 'New Info')
    let newInfoJson: NewInformationJson = {
      source: msg.getRef(),
      eClass: EClasses.NewInformation,
      message: 'New Info',
      position: {x: 0, y: 0, w: 5, h: 5},
    }
    expect(newInfo.toJson()).toEqual(newInfoJson);
  });

  it('should delete a "used on" on an info', () => {
    let m0 = new ReceiveMessage(undefined, 1, "receive1")
    let m1 = new SendMessage(undefined, 1, "send1")

    let i0 = Preknowledge.create('pre0')
    let i1 = NewInformation.create(m0, 'i1', false)

    i0.addIsUsedOn(m1);
    i1.addIsUsedOn(m1);

    expect(m1.uses.length).toBe(2)

    i0.destruct()
    expect(m1.uses.length).toBe(1)

    i1.destruct()
    expect(m1.uses.length).toBe(0)
  })

  it('should delete a "repeated by" on an info', () => {
    let m0 = new ReceiveMessage(undefined, 0, "receive0")
    let m1 = new ReceiveMessage(undefined, 1, "receive1")

    let i0 = Preknowledge.create('pre0')
    let i1 = NewInformation.create(m0, 'i1', false)

    i0.addRepeatedBy(m1);
    i1.addRepeatedBy(m1);

    expect(m1.repeats.length).toBe(2)

    i0.destruct()
    expect(m1.repeats.length).toBe(1)

    i1.destruct()
    expect(m1.repeats.length).toBe(0)

    i0.addRepeatedBy(m1);
    expect(m1.repeats.length).toBe(1)
    i0.removeRepeatedBy(m1);
    expect(m1.repeats.length).toBe(0)
  })

  it('should serialize information links', () => {
    let msg = new ReceiveMessage(undefined, 1, "receiveContent")
    let newInfo1 = NewInformation.create(msg, 'New Info1')
    let newInfo2 = NewInformation.create(msg, 'New Info2')
    let preknowledge1 = Preknowledge.create('Preknowledge1')
    let preknowledge2 = Preknowledge.create('Preknowledge2')

    // ***** candidates **********
    let infoLink_new_new = InformationLink.create(newInfo1, newInfo2, InformationLinkType.SUPPLEMENT, 'text')
    let infoLink_new_new_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      linkText: "text",
      source: RefHandler.createRef('', EClasses.NewInformation),
      target: RefHandler.createRef('', EClasses.NewInformation),
      type: InformationLinkType.SUPPLEMENT
    }
    expect(infoLink_new_new.toJson()).toEqual(infoLink_new_new_Json);

    let infoLink_new_pre = InformationLink.create(newInfo1, preknowledge1, InformationLinkType.STRONG_ATTACK, 'text')
    let infoLink_new_pre_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      linkText: "text",
      source: RefHandler.createRef('', EClasses.NewInformation),
      target: RefHandler.createRef('', EClasses.Preknowledge),
      type: InformationLinkType.STRONG_ATTACK
    }
    expect(infoLink_new_pre.toJson()).toEqual(infoLink_new_pre_Json);

    let infoLink_pre_new = InformationLink.create(preknowledge1, newInfo1, InformationLinkType.SUPPORT)
    let infoLink_pre_new_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      source: RefHandler.createRef('', EClasses.Preknowledge),
      target: RefHandler.createRef('', EClasses.NewInformation),
      type: InformationLinkType.SUPPORT
    }
    expect(infoLink_pre_new.toJson()).toEqual(infoLink_pre_new_Json);

    let infoLink_pre_pre = InformationLink.create(preknowledge1, preknowledge2, InformationLinkType.STRONG_SUPPORT)
    let infoLink_pre_pre_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      source: RefHandler.createRef('', EClasses.Preknowledge),
      target: RefHandler.createRef('', EClasses.Preknowledge),
      type: InformationLinkType.STRONG_SUPPORT
    }
    expect(infoLink_pre_pre.toJson()).toEqual(infoLink_pre_pre_Json);

    let infoLink_pre_pre_2 = InformationLink.create(preknowledge1, preknowledge2, InformationLinkType.ATTACK)
    let infoLink_pre_pre_2_Json: InformationLinkJson = {
      eClass: EClasses.InformationLink,
      source: RefHandler.createRef('', EClasses.Preknowledge),
      target: RefHandler.createRef('', EClasses.Preknowledge),
      type: InformationLinkType.ATTACK
    }
    expect(infoLink_pre_pre_2.toJson()).toEqual(infoLink_pre_pre_2_Json);
  });

  it('should delete an info link completely', () => {
    let p0 = Preknowledge.create('p0')
    let p1 = Preknowledge.create('p1')
    let link = InformationLink.create(p1, p0, InformationLinkType.SUPPORT)

    expect(p0.targetedBy.length).toEqual(1)
    link.destruct()
    expect(p0.targetedBy.length).toEqual(0)
  })

  it('source destruction: should delete an info that is a link source for two links completely (also deletes the links)', () => {
    let p0 = Preknowledge.create('p0')
    let p1 = Preknowledge.create('p1')
    let p2 = Preknowledge.create('p2')

    InformationLink.create( p0, p1, InformationLinkType.SUPPORT)
    InformationLink.create( p0, p2, InformationLinkType.SUPPLEMENT)
    expect(p0.causes.length).toEqual(2)
    expect(p1.targetedBy.length).toEqual(1)
    expect(p2.targetedBy.length).toEqual(1)

    p0.destruct()

    expect(p0.causes.length).toEqual(0)
    expect(p1.targetedBy.length).toEqual(0)
    expect(p2.targetedBy.length).toEqual(0)
  })

  it('target destruction: should delete an info that is a link target of two links completely (also deletes the links)', () => {
    let p0 = Preknowledge.create('p0')
    let p1 = Preknowledge.create('p1')
    let p2 = Preknowledge.create('p2')
    InformationLink.create(p1, p0, InformationLinkType.SUPPORT)
    InformationLink.create(p2, p0, InformationLinkType.SUPPLEMENT)
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
    let m0 = SendMessage.create( cp0, 0, 'm0')
    let m1 = SendMessage.create( cp0, 2, 'm1')
    let m2 = SendMessage.create( cp0, 5, 'm2')
    let m3 = SendMessage.create( cp0, 6, 'm3')

    let pre0 = Preknowledge.create('p0', false)
    let pre1 = Preknowledge.create('p1', false)
    let pre2 = Preknowledge.create('p2', false)
    let pre3 = Preknowledge.create('p3', false)

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

describe('deserialize and re-serialize', () => {

  it('should add attributes to preknowledge via fromJson', ()=> {
    let ref = RefHandler.createRef("", EClasses.Preknowledge)
    let preJson: PreknowledgeJson = {
      message: "pre0",
    }
    let res = Preknowledge.fromJson(preJson, ref)
    expect(res.message).toEqual("pre0")
  })

  it('should deserialize and re-serialize a real world example', () => {

    let json = require('@assets/test/3-2-keml-jackson.json');
    let convJson: ConversationJson = json as ConversationJson
    JsonFixer.prepareJsonInfoLinkSources(convJson);
    let conv = Conversation.fromJSON(convJson)
    let convJson2 = conv.toJson()

    let compRes = JsonComparer.compare(convJson, convJson2)
    expect(compRes.isLessEquals()).toEqual(true)
    let comp2 = JsonComparer.compare(convJson2, convJson)
    expect(comp2.isLessEquals()).toEqual(false)
  })

});
