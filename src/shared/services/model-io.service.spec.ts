import { TestBed } from '@angular/core/testing';

import { ModelIOService } from './model-io.service';
import {ConversationPartnerJson} from "../models/keml/json/sequence-diagram-models";
import {Conversation} from "../models/keml/conversation";
import {ConversationPartner} from "../models/keml/conversation-partner";
import {
  InformationLink,
  Message,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "../models/keml/msg-info";
import {Author} from "../models/keml/author";
import {InformationLinkType} from "../models/keml/json/knowledge-models";
import {Ref} from "../models/parser/ref";

describe('ModelIOService', () => {
  let service: ModelIOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelIOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse an original json (missing sources and eClasses) into a conversation', () => {
    let cpsText = "  \"conversationPartners\" : [ {\n" +
      "    \"name\" : \"LLM\"\n" +
      "  }, {\n" +
      "    \"name\" : \"Other\"\n" +
      "  } ]"
    let cp0 = new ConversationPartner('LLM', 0, new Ref('//@conversationPartners.0', 'http://www.unikoblenz.de/keml#//ConversationPartner'))
    let cp1 = new ConversationPartner('Other', 1, new Ref('//@conversationPartners.1', 'http://www.unikoblenz.de/keml#//ConversationPartner'))
    let cps = [cp0, cp1]

    let preknowledgeStr =
      " \"preknowledge\" : [" +
      "    {\n" +
      "      \"message\" : \"pre0\",\n" +
      "      \"isUsedOn\" : [ {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//SendMessage\",\n" +
      "        \"$ref\" : \"//@author/@messages.0\"\n " +
      "      } ],\n" +
      "      \"targetedBy\" : [ {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//InformationLink\",\n" +
      "        \"$ref\" : \"//@author/@messages.1/@generates.0/@causes.0\"\n" +
      "      } ]" +
      "    }, {" +
      "      \"message\" : \"pre1\",\n" +
      "      \"causes\" : [ {\n" +
      "        \"linkText\" : \"\",\n" +
      "        \"type\" : \"STRONG_ATTACK\",\n" +
      "        \"target\" : {\n" +
      "          \"eClass\" : \"http://www.unikoblenz.de/keml#//NewInformation\",\n" +
      "          \"$ref\" : \"//@author/@messages.1/@generates.1\"\n" +
      "        }\n" +
      "      } ]\n"+
      "    } ]\n"
    let pre0 = new Preknowledge('pre0',
      false, undefined, undefined, undefined, undefined, undefined, 0.5, 0.5, undefined, undefined,
      new Ref('//@author/@preknowledge.0', 'http://www.unikoblenz.de/keml#//PreKnowledge'))
    let pre1 = new Preknowledge('pre1',
      false, undefined, undefined, undefined, undefined, undefined, 0.5, 0.5, undefined, undefined,
      new Ref('//@author/@preknowledge.1', 'http://www.unikoblenz.de/keml#//PreKnowledge'))

    let preknowledge = [pre0, pre1]

    let newInfo0Str = "{\n" +
      "        \"message\" : \"ni0\",\n" +
      "        \"isInstruction\" : true,\n" +
      "        \"causes\" : [ {\n" +
      "         \"linkText\" : \"\",\n" +
      "         \"type\" : \"SUPPORT\",\n" +
      "         \"target\" : {\n" +
      "          \"eClass\" : \"http://www.unikoblenz.de/keml#//PreKnowledge\",\n" +
      "          \"$ref\" : \"//@author/@preknowledge.0\"\n" +
      "           }\n" +
      "         } ]" +
      "       }"

    let newInfo1Str = "{\n" +
      "        \"message\" : \"ni1\",\n" +
      "        \"targetedBy\" : [ {\n" +
      "          \"eClass\" : \"http://www.unikoblenz.de/keml#//InformationLink\",\n" +
      "          \"$ref\" : \"//@author/@preknowledge.1/@causes.0\"\n" +
      "        }]\n" +
      "}\n"

    let msgsStr =
      "\"messages\" : [ {" +
      "      \"eClass\" : \"http://www.unikoblenz.de/keml#//SendMessage\",\n" +
      "      \"content\" : \"m0\",\n" +
      "      \"counterPart\" : {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "        \"$ref\" : \"//@conversationPartners.0\"\n" +
      "      },"+
      "      \"originalContent\" : \"msg0long\",\n" +
      "      \"uses\" : [ {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//PreKnowledge\",\n" +
      "        \"$ref\" : \"//@author/@preknowledge.0\"\n" +
      "      } ] "+
      "   }, {\n" +
      "      \"eClass\" : \"http://www.unikoblenz.de/keml#//ReceiveMessage\",\n" +
      "      \"content\" : \"m1\",\n" +
      "      \"counterPart\" : {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "        \"$ref\" : \"//@conversationPartners.1\"\n" +
      "      },"+
      "      \"originalContent\" : \"msg1long\",\n" +
      "      \"generates\" : [ "+newInfo0Str +", "+newInfo1Str+
      "       ]\n" +
      "   } ]\n"
    let msg0 = new SendMessage(cp0,0, "m0", "msg0long", [pre0],
      new Ref('//@author/@messages.0', 'http://www.unikoblenz.de/keml#//SendMessage'))
    //todo
    pre0.isUsedOn.push(msg0)
    let msg1 = new ReceiveMessage(cp1, 1, "m1", "msg1long",
      undefined, undefined, false,
      new Ref('//@author/@messages.1', 'http://www.unikoblenz.de/keml#//ReceiveMessage')
  )
    let msgs: Message[] = [msg0, msg1]
    let newInfo0 = new NewInformation(msg1, "ni0", true)
    let newInfo1 = new NewInformation(msg1, "ni1")


    let infoLink0 = new InformationLink(newInfo0, pre0, InformationLinkType.SUPPLEMENT) // necessary to test JsonFixer.addMissingSupplementType
    let infoLink1 = new InformationLink(pre1, newInfo1, InformationLinkType.STRONG_ATTACK)

    let authorStr = "\"author\" : {" +
      msgsStr +",\n" +
      preknowledgeStr + "\n"+
      "}"

    let author = new Author(undefined,0, preknowledge, msgs )

    let str = "{" +
      "\"eClass\" : \"http://www.unikoblenz.de/keml#//Conversation\",\n" +
      "  \"title\" : \"Test1\"," +
      authorStr + ",\n" +
      cpsText +
      "}\n"

    let conv = new Conversation("Test1", author, cps)

    let callResult = service.loadKEML(str)
    expect(callResult.title).toEqual(conv.title)

    // ********* conversationPartners **************
    callResult.conversationPartners.forEach((cp, index) => {
      expect(cp.name).toEqual(cps[index].name)
      expect(cp.getRef()).toEqual(cps[index].getRef())
    }) //only name and ref, no gIds

    // ********* author **************
    expect(callResult.author.name).toEqual('')
    // ********* preknowledge **************
    callResult.author.preknowledge.forEach((pre, i) => {
      expect(pre.message).toEqual(preknowledge[i].message)
      expect(pre.getRef()).toEqual(preknowledge[i].getRef())
      expect(pre.isUsedOn.length).toEqual(preknowledge[i].isUsedOn.length)
      pre.isUsedOn.forEach((usage, j) => {
        expect(usage.getRef()).toEqual(preknowledge[i].isUsedOn[j].getRef())
      })
    })

    // ********* messages **************
    callResult.author.messages.forEach((msg, i) => {
      expect(msg.content).toEqual(msgs[i].content)
      expect(msg.originalContent).toEqual(msgs[i].originalContent)
      expect(msg.counterPart.getRef()).toEqual(msgs[i].counterPart.getRef())
      expect(msg.timing).toEqual(msgs[i].timing)
      expect(msg.getRef()).toEqual(msgs[i].getRef())
    })

  })

  it('should change a new info\'s source', () => {
    let cp = new ConversationPartner()
    let msg1 = new ReceiveMessage(cp, 0, "rec1")
    let msg2 = new ReceiveMessage(cp, 1, "rec2")
    let newInfo = new NewInformation(msg2, 'newInfo', false)
    expect(msg1.generates.length).toEqual(0)
    expect(msg2.generates.length).toEqual(1)
    expect(newInfo.source).toEqual(msg2)

    // call to test:
    service.changeInfoSource(newInfo, msg1)
    expect(msg1.generates.length).toEqual(1)
    expect(msg2.generates.length).toEqual(0)
    expect(newInfo.source).toEqual(msg1)
  })
});
