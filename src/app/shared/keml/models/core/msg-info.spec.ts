import {InformationLink, NewInformation, Preknowledge, ReceiveMessage, SendMessage} from "./msg-info";
import {InformationLinkJson, InformationLinkType, NewInformationJson, PreknowledgeJson} from "@app/shared/keml/models/json/knowledge-models";
import {ConversationPartner} from "./conversation-partner";
import {ReceiveMessageJson, SendMessageJson} from "@app/shared/keml/models/json/sequence-diagram-models";
import {Ref} from "@app/shared/keml/models/refs/ref";

describe('Msg-Info (models)', () => {

  it('should prepare the information serialization for getRef', () => {
    let preknowledge = new Preknowledge()
     preknowledge.prepare('fantasy')
    expect (preknowledge.getRef()).toEqual(new Ref('fantasy', Preknowledge.eClass));
  })

  it('should serialize a send msg', () => {
    let cp = new ConversationPartner()
    let msg = new SendMessage(cp, 0, "sendContent")
    let msgJson: SendMessageJson = {
      eClass: SendMessage.eClass,
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
      eClass: ReceiveMessage.eClass,
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


  it('should serialize preknowledge', () => {
    let preknowledge = new Preknowledge()
    let preknowledgeJson : PreknowledgeJson = {
      causes: [],
      currentTrust: undefined,
      eClass: Preknowledge.eClass,
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
      eClass: NewInformation.eClass,
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
      eClass: InformationLink.eClass,
      linkText: "text",
      source: new Ref('', NewInformation.eClass),
      target: new Ref('', NewInformation.eClass),
      type: InformationLinkType.SUPPLEMENT
    }
    expect(infoLink_new_new.toJson()).toEqual(infoLink_new_new_Json);

    let infoLink_new_pre = new InformationLink(newInfo1, preknowledge1, InformationLinkType.STRONG_ATTACK, 'text')
    let infoLink_new_pre_Json: InformationLinkJson = {
      eClass: InformationLink.eClass,
      linkText: "text",
      source: new Ref('', NewInformation.eClass),
      target: new Ref('', Preknowledge.eClass),
      type: InformationLinkType.STRONG_ATTACK
    }
    expect(infoLink_new_pre.toJson()).toEqual(infoLink_new_pre_Json);

    let infoLink_pre_new = new InformationLink(preknowledge1, newInfo1, InformationLinkType.SUPPORT)
    let infoLink_pre_new_Json: InformationLinkJson = {
      eClass: InformationLink.eClass,
      linkText: undefined,
      source: new Ref('', Preknowledge.eClass),
      target: new Ref('', NewInformation.eClass),
      type: InformationLinkType.SUPPORT
    }
    expect(infoLink_pre_new.toJson()).toEqual(infoLink_pre_new_Json);

    let infoLink_pre_pre = new InformationLink(preknowledge1, preknowledge2, InformationLinkType.STRONG_SUPPORT)
    let infoLink_pre_pre_Json: InformationLinkJson = {
      eClass: InformationLink.eClass,
      linkText: undefined,
      source: new Ref('', Preknowledge.eClass),
      target: new Ref('', Preknowledge.eClass),
      type: InformationLinkType.STRONG_SUPPORT
    }
    expect(infoLink_pre_pre.toJson()).toEqual(infoLink_pre_pre_Json);

    let infoLink_pre_pre_2 = new InformationLink(preknowledge1, preknowledge2, InformationLinkType.ATTACK)
    let infoLink_pre_pre_2_Json: InformationLinkJson = {
      eClass: InformationLink.eClass,
      linkText: undefined,
      source: new Ref('', Preknowledge.eClass),
      target: new Ref('', Preknowledge.eClass),
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

  it('should delete an info that is a link source completely (also deletes the link)', () => {
    let p0 = new Preknowledge('p0')
    let p1 = new Preknowledge('p1')
    let link = new InformationLink(p1, p0, InformationLinkType.SUPPORT)
    expect(p0.targetedBy.length).toEqual(1)

    p1.destruct()
    expect(p0.targetedBy.length).toEqual(0)
  })

  it('should delete an info that is a link target completely (also deletes the link)', () => {
    let p0 = new Preknowledge('p0')
    let p1 = new Preknowledge('p1')
    let link = new InformationLink(p1, p0, InformationLinkType.SUPPORT)
    expect(p1.causes.length).toEqual(1)

    p0.destruct()
    expect(p1.causes.length).toEqual(0)
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

    expect(pre0.timeInfo()).toEqual(0)
    expect(pre1.timeInfo()).toEqual(0)
    expect(pre2.timeInfo()).toEqual(2)
    expect(pre3.timeInfo()).toEqual(6)
  })
});
