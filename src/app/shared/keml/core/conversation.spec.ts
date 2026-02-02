import {Conversation} from './conversation';
import {
  InformationLink,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";
import {ReceiveMessageJson} from "@app/shared/keml/json/sequence-diagram-models";

describe('Conversation', () => {
  it('should create an instance', () => {
    expect(new Conversation()).toBeTruthy();
  });

  it('verify that refs are correctly set for toJson: should serialize a conversation with missing or wrong refs correctly', () => {
    let conv = new Conversation();
    conv.title = "Change conv"
    let cp0 = new ConversationPartner({$ref: 'wrong', eClass: 'wronger'}, 'NewPartner', 0);
    conv.addCP(cp0)
    expect(cp0.getRef().$ref).toEqual('wrong')
    expect(conv.author.getRef().$ref).toEqual('');
    let m0 = SendMessage.create(cp0, 0)
    let m1 = ReceiveMessage.create(cp0, 1)
    conv.author.addMessage(m0, m1)
    expect(m0.getRef().$ref).toEqual('');
    expect(m1.getRef().$ref).toEqual('');

    //infos:
    let p0 = Preknowledge.create()
    conv.author.addPreknowledge(p0)
    expect(p0.getRef().$ref).toEqual('');
    let n0 = NewInformation.create(m1, 'rec')
    expect(n0.getRef().$ref).toEqual('');

    InformationLink.create(n0, p0, InformationLinkType.STRONG_ATTACK)

    // serialization:
    let convJson = conv.toJson()
    expect(convJson.author.messages[0].counterPart.$ref).toEqual('//@conversationPartners.0')
    expect(convJson.author.preknowledge[0].targetedBy[0].$ref).toEqual('//@author/@messages.1/@generates.0/@causes.0')
    expect((convJson.author.messages[1] as ReceiveMessageJson).generates[0].causes[0].target.$ref ).toEqual('//@author/@preknowledge.0')
  })
});
