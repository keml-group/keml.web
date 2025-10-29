import { Conversation } from './conversation';
import {Author} from "@app/shared/keml/core/author";
import {SendMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

describe('Conversation', () => {
  it('should create an instance', () => {
    expect(new Conversation()).toBeTruthy();
  });

  it('verify that refs are correctly set for toJson: should serialize a conversation with missing refs correctly', () => {
    let conv = new Conversation();
    conv.title = "Change conv"
    let cp0 = new ConversationPartner();
    conv.addCP(cp0)
    expect(cp0.getRef().$ref).toEqual('')
    let author = new Author();
    conv.author = author;
    expect(conv.author.getRef().$ref).toEqual('');
    let m0 = new SendMessage(cp0, 0)
    author.addMessage(m0)
    expect(m0.getRef().$ref).toEqual('');
    let convJson = conv.toJson()
    expect(convJson.author.messages[0].counterPart.$ref).toEqual('//@conversationPartners.0')
  })
});
