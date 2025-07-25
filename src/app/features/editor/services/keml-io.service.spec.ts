import { TestBed } from '@angular/core/testing';

import { KEMLIOService } from './keml-io.service';
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {Ref, Referencable} from "emfular";
import {
  InformationLink,
  Message,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "@app/shared/keml/models/core/msg-info";
import {LayoutHelper} from "@app/features/editor/utils/layout-helper";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";
import {Author} from "@app/shared/keml/models/core/author";
import {Conversation} from "@app/shared/keml/models/core/conversation";

describe('KEMLIOService', () => {
  let service: KEMLIOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KEMLIOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
    let cp0 = new ConversationPartner('LLM', 300, new Ref('//@conversationPartners.0', 'http://www.unikoblenz.de/keml#//ConversationPartner'))
    let cp1 = new ConversationPartner('Other', 450, new Ref('//@conversationPartners.1', 'http://www.unikoblenz.de/keml#//ConversationPartner'))
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
    LayoutHelper.positionPreknowledge(preknowledge)

    let newInfo0Str = "{\n" +
      "        \"message\" : \"ni0\",\n" +
      "        \"isInstruction\" : true,\n" +
      "        \"causes\" : [ {\n" +
      "         \"linkText\" : \"\",\n" +
      "         \"type\" : \"SUPPLEMENT\",\n" +
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
    let newInfo0 = new NewInformation(msg1, "ni0", true,
      undefined, undefined, undefined, undefined, undefined, 0.5, 0.5, undefined, undefined,
      new Ref('//@author/@messages.1/@generates.0', 'http://www.unikoblenz.de/keml#//NewInformation'))
    let newInfo1 = new NewInformation(msg1, "ni1",
      false,undefined, undefined, undefined, undefined, undefined, 0.5, 0.5, undefined, undefined,
      new Ref('//@author/@messages.1/@generates.1', 'http://www.unikoblenz.de/keml#//NewInformation'))

    LayoutHelper.initializeInfoPos(msgs)

    let infoLink0 = new InformationLink(newInfo0, pre0, InformationLinkType.SUPPLEMENT, undefined, new Ref('//@author/@messages.1/@generates.0/@causes.0', 'http://www.unikoblenz.de/keml#//InformationLink')) // necessary to test JsonFixer.addMissingSupplementType
    let infoLink1 = new InformationLink(pre1, newInfo1, InformationLinkType.STRONG_ATTACK, undefined, new Ref( '//@author/@preknowledge.1/@causes.0', 'http://www.unikoblenz.de/keml#//InformationLink'))

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

    function testListRefs<T extends Referencable>(l1: T[], l2: T[]) {
      expect(l1.length).toEqual(l2.length)
      l1.forEach((l,i) => {
        expect(l.getRef()).toEqual(l2[i].getRef())
      })
    }

    // ********* conversationPartners **************
    callResult.conversationPartners.forEach((cp, index) => {
      expect(cp.name).toEqual(cps[index].name)
      expect(cp.getRef()).toEqual(cps[index].getRef())
      expect(cp.xPosition).toEqual(cps[index].xPosition)
    })

    // ********* author **************
    expect(callResult.author.name).toEqual('')
    // ********* preknowledge **************
    callResult.author.preknowledge.forEach((pre, i) => {
      expect(pre.message).toEqual(preknowledge[i].message)
      expect(pre.position).toEqual(preknowledge[i].position)
      expect(pre.getRef()).toEqual(preknowledge[i].getRef())
      testListRefs(pre.isUsedOn, preknowledge[i].isUsedOn)
    })

    // ********* messages **************
    callResult.author.messages.forEach((msg, i) => {
      expect(msg.content).toEqual(msgs[i].content)
      expect(msg.originalContent).toEqual(msgs[i].originalContent)
      expect(msg.counterPart.getRef()).toEqual(msgs[i].counterPart.getRef())
      expect(msg.timing).toEqual(msgs[i].timing)
      expect(msg.getRef()).toEqual(msgs[i].getRef())
    })
    testListRefs(
      (callResult.author.messages[0] as SendMessage).uses,
      msg0.uses
    )
    let resultRec = (callResult.author.messages[1] as ReceiveMessage)
    testListRefs(resultRec.generates, msg1.generates)
    testListRefs(resultRec.repeats, msg1.repeats)

    // ********** newInfo ****************
    let resultNewInfos = (callResult.author.messages[1] as ReceiveMessage).generates
    resultNewInfos.forEach((newInfo, i) => {
      expect(newInfo.message).toEqual(msg1.generates[i].message)
      expect(newInfo.isInstruction).toEqual(msg1.generates[i].isInstruction)
      expect(newInfo.position).toEqual(msg1.generates[i].position)
      expect(newInfo.source.getRef()).toEqual(msg1.generates[i].source.getRef())
      testListRefs(newInfo.causes, msg1.generates[i].causes)
      testListRefs(newInfo.targetedBy, msg1.generates[i].targetedBy)
      testListRefs(newInfo.isUsedOn, msg1.generates[i].isUsedOn)
      testListRefs(newInfo.repeatedBy, msg1.generates[i].repeatedBy)
    })

    // ********** infoLinks **************
    let resultLink0 = resultNewInfos[0].causes[0]
    let resultLink1 = callResult.author.preknowledge[1].causes[0]
    function compareLinks(l1: InformationLink, l2: InformationLink) {
      expect(l1.getRef()).toEqual(l2.getRef())
      expect(l1.source.getRef()).toEqual(l2.source.getRef())
      expect(l1.target.getRef()).toEqual(l2.target.getRef())
      expect(l1.type).toEqual(l2.type)
      expect(l1.linkText).toEqual(l2.linkText)
    }
    compareLinks(resultLink0, infoLink0)
    compareLinks(resultLink1, infoLink1)
  })
});
