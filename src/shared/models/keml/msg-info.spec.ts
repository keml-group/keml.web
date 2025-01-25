import {NewInformation, Preknowledge, ReceiveMessage, SendMessage} from "./msg-info";
import {NewInformationJson, PreknowledgeJson} from "./json/knowledge-models";
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
});
