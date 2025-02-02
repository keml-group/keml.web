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
    let msg0 = new SendMessage(cp0,0, "m0", "m0long", [pre0],
      new Ref('//@author/@messages.0', 'http://www.unikoblenz.de/keml#//SendMessage'))
    //todo
    pre0.isUsedOn.push(msg0)
    let msg1 = new ReceiveMessage(cp1, 1, "m1", "m1long",
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
    callResult.conversationPartners.forEach((cp, index) => {
      expect(cp.name).toEqual(cps[index].name)
      expect(cp.getRef()).toEqual(cps[index].getRef())
    }) //only name and ref, no gIds

    expect(callResult.author.name).toEqual('')
    callResult.author.preknowledge.forEach((pre, i) => {
      expect(pre.message).toEqual(preknowledge[i].message)
      expect(pre.getRef()).toEqual(preknowledge[i].getRef())
      expect(pre.isUsedOn.length).toEqual(preknowledge[i].isUsedOn.length)
      pre.isUsedOn.forEach((usage, j) => {
        expect(usage.getRef()).toEqual(preknowledge[i].isUsedOn[j].getRef())
      })
    })

    //expect(callResult).toEqual(conv)
  })

  it('should parse a json into a conversation', () => {
    let convPartnersStr: string = "  \"conversationPartners\" : [ " +
      "     {\n" +
      "     \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "     \"name\" : \"LLM\"\n" +
      "     }," +
      "     {\n" +
      "     \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "     \"name\" : \"Other\"\n" +
      "     }" +
      " ]\n";
    let cp0Json: ConversationPartnerJson = {name: "LLM", xPosition:300, eClass: "http://www.unikoblenz.de/keml#//ConversationPartner", $ref: '//@conversationPartners.0'};
    let cp1Json: ConversationPartnerJson = {name: "Other", xPosition:450, eClass: "http://www.unikoblenz.de/keml#//ConversationPartner", $ref: '//@conversationPartners.1'};
    let convPartnersJson: ConversationPartnerJson[] = [cp0Json, cp1Json];

    let cp0 = new ConversationPartner("LLM", 300)
    let cp1 = new ConversationPartner("Other", 450)

    let msg1Str = "  {\n" +
      "      \"eClass\" : \"http://www.unikoblenz.de/keml#//SendMessage\",\n" +
      "      \"content\" : \"question1\",\n" +
      "      \"timing\" : 1,\n" +
      "      \"counterPart\" : {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "        \"$ref\" : \"//@conversationPartners.0\"\n" +
      "         },\n" +
      "      \"originalContent\" : \"long question1\"\n" +
      "      }";
    let msg1 = new SendMessage(cp0,0, 'question1', )


    let info1aStr = " {\n" +
      "         \"message\" : \"info1a\",\n" +
      "         \"isInstruction\" : true,\n" +
      "         \"targetedBy\" : [ " +
      "           {\n" +
      "           \"eClass\" : \"http://www.unikoblenz.de/keml#//InformationLink\",\n" +
      "           \"$ref\" : \"//@author/@messages.1/@generates.1/@causes.0\"\n" +
      "           }," +
      "           {\n" +
      "             \"eClass\" : \"http://www.unikoblenz.de/keml#//InformationLink\",\n" +
      "             \"$ref\" : \"//@author/@preknowledge.0/@causes.0\"\n" +
      "           } " +
      "        ],\n" +
      "        \"causes\" : [ " +
      "           {\n" +
      "           \"linkText\" : \"link text\",\n" +
      "           \"target\" : " +
      "             {\n" +
      "             \"eClass\" : \"http://www.unikoblenz.de/keml#//NewInformation\",\n" +
      "             \"$ref\" : \"//@author/@messages.1/@generates.1\"\n" +
      "             }\n" +
      "           }" +
      "        ]\n" +
      "      } ";

    let msg2Str = "      {\n" +
      "      \"eClass\" : \"http://www.unikoblenz.de/keml#//ReceiveMessage\",\n" +
      "      \"content\" : \"answer1\",\n" +
      "      \"timing\" : 2,\n" +
      "      \"counterPart\" : {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "        \"$ref\" : \"//@conversationPartners.0\"\n" +
      "         },\n" +
      "      \"originalContent\" : \"long answer1\",\n" +
      "      \"generates\" : [ " +
      info1aStr +
      "       ]" +
      "      } ";

    /*let msg2 = new ReceiveMessage()
    let info1a = new NewInformation()*/

    let str = "{\n" +
      "  \"eClass\" : \"http://www.unikoblenz.de/keml#//Conversation\",\n" +
      "  \"title\" : \"Test-Conv\",\n" +
      "  \"author\" : {\n" +
      "    \"messages\" : [ \n" +
      msg1Str + ",\n" +
      msg2Str +
      "     ]" +
      "   },\n" +
      convPartnersStr +
      "}";
    let conv: Conversation = service.loadKEML(str);
    expect(conv).toBeDefined();
    expect(conv.title).toEqual("Test-Conv");
    expect(conv.conversationPartners?.at(0)?.name).toEqual("LLM");
    expect(conv.conversationPartners?.at(1)?.name).toEqual("Other");
    expect(conv.author?.messages?.at(0)?.counterPart).toBe(conv.conversationPartners?.at(0))
  });

  it('should change a new info\'s source', () => {
    let cp = new ConversationPartner()
    let msg1 = new ReceiveMessage(cp, 0, "rec1")
    let msg2 = new ReceiveMessage(cp, 1, "rec2")
    let newInfo = new NewInformation(msg2, 'newInfo', false)
    msg2.generates.push(newInfo)
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
