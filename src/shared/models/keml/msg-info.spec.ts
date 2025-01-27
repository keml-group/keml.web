import {InformationLink, NewInformation, Preknowledge, ReceiveMessage, SendMessage} from "./msg-info";
import {InformationLinkJson, InformationLinkType, NewInformationJson, PreknowledgeJson} from "./json/knowledge-models";
import {ConversationPartner} from "./conversation-partner";
import {ReceiveMessageJson, SendMessageJson} from "./json/sequence-diagram-models";

describe('Msg-Info (models)', () => {

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
      currentTrust: 0.5,
      eClass: Preknowledge.eClass,
      position: {x: 0, y: 0, w: 5, h: 5},
      feltTrustAfterwards: undefined,
      feltTrustImmediately: undefined,
      initialTrust: 0.5,
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
      currentTrust: 0.5,
      eClass: NewInformation.eClass,
      feltTrustAfterwards: undefined,
      feltTrustImmediately: undefined,
      initialTrust: 0.5,
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
      eClass: "http://www.unikoblenz.de/keml#//InformationLink",
      linkText: "text",
      source: newInfo1.getRef(),
      target: newInfo2.getRef(),
      type: InformationLinkType.SUPPLEMENT
    }
    expect(infoLink_new_new.toJson()).toEqual(infoLink_new_new_Json);
    
    let infoLink_new_pre = new InformationLink(newInfo1, preknowledge1, InformationLinkType.STRONG_ATTACK, 'text')
    let infoLink_new_pre_Json: InformationLinkJson = {
      eClass: "http://www.unikoblenz.de/keml#//InformationLink",
      linkText: "text",
      source: newInfo1.getRef(),
      target: preknowledge1.getRef(),
      type: InformationLinkType.STRONG_ATTACK
    }
    expect(infoLink_new_pre.toJson()).toEqual(infoLink_new_pre_Json);
  });


});
