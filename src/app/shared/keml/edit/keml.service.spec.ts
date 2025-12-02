import { TestBed } from '@angular/core/testing';

import { KemlService } from './keml.service';
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {
  InformationLink,
  Message,
  NewInformation, Preknowledge,
  ReceiveMessage, SendMessage,
} from "@app/shared/keml/core/msg-info";
import {LayoutingService} from "@app/shared/keml/graphical/layouting.service";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";
import {Author} from "@app/shared/keml/core/author";
import {Conversation} from "@app/shared/keml/core/conversation";
import {Referencable, RefHandler} from "emfular";
import {of} from "rxjs";
import {KemlHistoryService} from "@app/shared/keml/edit/keml-history.service";

describe('KEML-Service', () => {
  let service: KemlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KemlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should determine if a repetition is allowed', () => {
    let cp = new ConversationPartner('cp')
    let rec = new ReceiveMessage(cp, 5)
    let newInfo = new NewInformation(rec, 'info1')
    let pre0 = new Preknowledge('pre0')
    let pre1 = new Preknowledge('pre1')
    let send3 = new SendMessage(cp, 3)
    pre0.addIsUsedOn(send3)
    expect(KemlService.isRepetitionAllowed(rec, newInfo)).toBe(false)
    expect(KemlService.isRepetitionAllowed(rec, pre1)).toBe(true)
    expect(KemlService.isRepetitionAllowed(rec, pre0)).toBe(true)
    rec.timing = 1
    expect(KemlService.isRepetitionAllowed(rec, pre0)).toBe(false)
    expect(KemlService.isRepetitionAllowed(rec, pre1)).toBe(true)
  })

  it('should adapt the msgCount correctly', () => {
    let cp0 = service.addNewConversationPartner('cp0')
    let cp1 = service.addNewConversationPartner('cp1')

    expect(service.msgCount()).toEqual(0)
    service.addNewMessage(true, cp0, 'send0')
    service.addNewMessage(false, cp0, 'rec0')
    expect(service.msgCount()).toEqual(2)
    service.addNewMessage(true, cp1, 'send1')
    expect(service.msgCount()).toEqual(3)
    let msg4 = service.addNewMessage(false, cp0, 'rec1')
    expect(service.msgCount()).toEqual(4)
    service.duplicateMessage(msg4!)
    expect(service.msgCount()).toEqual(5)

    service.deleteMessage(msg4!)
    expect(service.msgCount()).toEqual(4)

    service.deleteConversationPartner(cp0)
    expect(service.msgCount()).toEqual(1)

    service.newConversation()
    expect(service.msgCount()).toEqual(0)
  })

  it('should set trusts to undefined on preknowledge creation', () => {
    let p0 = service.addNewPreknowledge()
    expect(p0.initialTrust).toBe(undefined)
    expect(p0.currentTrust).toBe(undefined)
    expect(p0.feltTrustImmediately).toBe(undefined)
    expect(p0.feltTrustAfterwards).toBe(undefined)
  });

  it('should set trusts to undefined on new info creation', () => {
    let cp0 = service.addNewConversationPartner()
    let rec0 = service.addNewMessageNoHistory(false, cp0)
    let i0 = (service.addNewNewInfo((rec0 as ReceiveMessage)) as NewInformation)
    expect(i0.initialTrust).toBe(undefined)
    expect(i0.currentTrust).toBe(undefined)
    expect(i0.feltTrustImmediately).toBe(undefined)
    expect(i0.feltTrustAfterwards).toBe(undefined)
  });

  it('should parse an original json (missing sources and eClasses) into a conversation', () => {
    let cpsText = "  \"conversationPartners\" : [ {\n" +
      "    \"name\" : \"LLM\"\n" +
      "  }, {\n" +
      "    \"name\" : \"Other\"\n" +
      "  } ]"
    let cp0 = new ConversationPartner('LLM', 300, RefHandler.createRef('//@conversationPartners.0', 'http://www.unikoblenz.de/keml#//ConversationPartner'))
    let cp1 = new ConversationPartner('Other', 450, RefHandler.createRef('//@conversationPartners.1', 'http://www.unikoblenz.de/keml#//ConversationPartner'))
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
    let pre0 = new Preknowledge(
      'pre0', false, undefined,
      undefined, undefined, 0.5, 0.5, undefined, undefined,
      RefHandler.createRef('//@author/@preknowledge.0', 'http://www.unikoblenz.de/keml#//PreKnowledge'))
    let pre1 = new Preknowledge(
      'pre1', false, undefined,
      undefined, undefined, 0.5, 0.5, undefined, undefined,
      RefHandler.createRef('//@author/@preknowledge.1', 'http://www.unikoblenz.de/keml#//PreKnowledge'))

    let preknowledge = [pre0, pre1]
    LayoutingService.positionPreknowledge(preknowledge)

    let newInfo0Str = "{\n" +
      "        \"message\" : \"ni0\",\n" +
      "        \"isInstruction\" : true,\n" +
      "        \"causes\" : [ {\n" +
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
      RefHandler.createRef('//@author/@messages.0', 'http://www.unikoblenz.de/keml#//SendMessage'))
    let msg1 = new ReceiveMessage(cp1, 1, "m1", "msg1long",
      undefined, false,
      RefHandler.createRef('//@author/@messages.1', 'http://www.unikoblenz.de/keml#//ReceiveMessage')
    )
    let msgs: Message[] = [msg0, msg1]
    let newInfo0 = new NewInformation(msg1, "ni0", true,
      undefined, undefined, undefined, 0.5, 0.5, undefined, undefined,
      RefHandler.createRef('//@author/@messages.1/@generates.0', 'http://www.unikoblenz.de/keml#//NewInformation'))
    let newInfo1 = new NewInformation(msg1, "ni1",
      false,undefined, undefined, undefined, 0.5, 0.5, undefined, undefined,
      RefHandler.createRef('//@author/@messages.1/@generates.1', 'http://www.unikoblenz.de/keml#//NewInformation'))

    LayoutingService.initializeInfoPos(msgs)

    let infoLink0 = new InformationLink(newInfo0, pre0, InformationLinkType.SUPPLEMENT, undefined, RefHandler.createRef('//@author/@messages.1/@generates.0/@causes.0', 'http://www.unikoblenz.de/keml#//InformationLink')) // necessary to test JsonFixer.addMissingSupplementType
    let infoLink1 = new InformationLink(pre1, newInfo1, InformationLinkType.STRONG_ATTACK, '', RefHandler.createRef( '//@author/@preknowledge.1/@causes.0', 'http://www.unikoblenz.de/keml#//InformationLink'))

    let authorStr = "\"author\" : {" +
      msgsStr +",\n" +
      preknowledgeStr + "\n"+
      "}"

    let author = new Author(undefined,0 )
    author.addPreknowledge(...preknowledge)
    author.addMessage(...msgs)

    let str = "{" +
      "\"eClass\" : \"http://www.unikoblenz.de/keml#//Conversation\",\n" +
      "  \"title\" : \"Test1\"," +
      authorStr + ",\n" +
      cpsText +
      "}\n"

    let conv = new Conversation("Test1", author)
    conv.addCP(...cps)

    let callResult = service.loadConversation(JSON.parse(str))
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

    //msgSignal:
    expect(service.msgCount()).toEqual(2)

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

describe('KemlService: verify method results - also KemlHistory interplay: when to call save', () => {
  let kemlService: KemlService;
  let historyStub: any;

  beforeEach(() => {

    historyStub = {
      // minimal observable so KemlService can subscribe without error
      state$: of(null),
      save: jasmine.createSpy('save')
    };

    TestBed.configureTestingModule({
      providers: [
          KemlService,
        {provide: KemlHistoryService, useValue: historyStub},
      ]
    })

    kemlService = TestBed.inject(KemlService);
  });

  it('should call save on saveCurrentState', () => {
    const kemlConv = kemlService.conversation.toJson()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.saveCurrentState()
    expect(historyStub.save).toHaveBeenCalledTimes(1)
    expect(historyStub.save).toHaveBeenCalledWith(kemlConv)
  })

  it('should not call save on normal serialization call; it should just deliver the current conv as json', () => {
    const kemlConv = kemlService.conversation.toJson()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    let res = kemlService.serializeConversation()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(res).toEqual(kemlConv)
  })

  it('should create a new conversation; without history on first method and with history on second method', () => {
    kemlService.newConversationNoHistory("test")
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    const res = kemlService.conversation.toJson()
    expect(res).toEqual(new Conversation("test").toJson())

    kemlService.newConversation("test1")
    expect(historyStub.save).toHaveBeenCalledTimes(1)
    expect(historyStub.save).toHaveBeenCalledOnceWith(new Conversation("test1").toJson())
  })

  //(cannot test deserialize to not call history) it is private
  it('should call history once on load', () => {
    const exampleConv = new Conversation("testLoad").toJson()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation.title == exampleConv.title).toBeFalse()
    kemlService.loadConversation(exampleConv)
    const loadedConv = kemlService.conversation.toJson()
    expect(loadedConv.title == exampleConv.title).toBeTrue()
    expect(historyStub.save).toHaveBeenCalledTimes(1)
    expect(historyStub.save).toHaveBeenCalledOnceWith(loadedConv)
  })

  it('should not call save on getters', () => {
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.getTitle()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.getAuthor()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.getConversationPartners()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.getSends()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.getReceives()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.getFirstReceive()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
  })

  it('should call history on conversation partner creation but not on the version without history', () => {
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.addNewConversationPartnerNoHistory("cp0")
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.addNewConversationPartner("cp1")
    expect(historyStub.save).toHaveBeenCalledTimes(1)
    let res = kemlService.serializeConversation()
    expect(historyStub.save).toHaveBeenCalledOnceWith(res)
    expect(res.conversationPartners.map(cp=> cp.name)).toEqual(["cp0", "cp1"])
  })

  it("should not call history on cp isMoveDisabled", () => {
    let cp = new ConversationPartner("cp")
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.isMoveConversationPartnerLeftDisabled(cp)
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.isMoveConversationPartnerRightDisabled(cp)
    expect(historyStub.save).toHaveBeenCalledTimes(0)
  })

  it('should move and call history on real cp movement (=if move possible)', () => {
    let cp0 = kemlService.addNewConversationPartnerNoHistory("cp0")
    let cp1 = kemlService.addNewConversationPartnerNoHistory("cp1")
    let cp2 = kemlService.addNewConversationPartnerNoHistory("cp2")

    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation.conversationPartners.map(cp=> cp.name)).toEqual(["cp0", "cp1", "cp2"])
    //*** impossible move:
    //right
    kemlService.moveConversationPartnerRight(cp2)
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation.conversationPartners.map(cp=> cp.name)).toEqual(["cp0", "cp1", "cp2"])
    //left
    kemlService.moveConversationPartnerLeft(cp0)
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation.conversationPartners.map(cp=> cp.name)).toEqual(["cp0", "cp1", "cp2"])
    //***possible move:
    //right
    kemlService.moveConversationPartnerRight(cp1)
    expect(historyStub.save).toHaveBeenCalledTimes(1)
    expect(kemlService.conversation.conversationPartners.map(cp=> cp.name)).toEqual(["cp0", "cp2", "cp1"])
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.serializeConversation())
    //left
    kemlService.moveConversationPartnerLeft(cp2)
    expect(historyStub.save).toHaveBeenCalledTimes(2)
    expect(kemlService.conversation.conversationPartners.map(cp=> cp.name)).toEqual(["cp2", "cp0", "cp1"])
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.serializeConversation())
  })

  function prepareCpWith4Messages(): ConversationPartner {
    const cp = kemlService.addNewConversationPartnerNoHistory("cp0")
    for (let i = 0; i < 4; i++) {
      kemlService.addNewMessageNoHistory(i/2==0,cp, "message"+i)
    }
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation.conversationPartners.length).toBe(1)
    expect(kemlService.conversation.author.messages.length).toBe(4)

    return cp;
  }

  it('should call save history once on deleteCp', () => {
    // todo history only if cp exists on current conv?
    const cp = prepareCpWith4Messages();
    // actual call:
    kemlService.deleteConversationPartner(cp)
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())
    expect(kemlService.conversation.conversationPartners.length).toBe(0)
    expect(kemlService.conversation.author.messages.length).toBe(0)
  })

  it('should call save history once on duplicateCp', () => {
    const cp = prepareCpWith4Messages();
    // actual call:
    kemlService.duplicateConversationPartner(cp)
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())
    expect(kemlService.conversation.conversationPartners.length).toBe(2)
    expect(kemlService.conversation.author.messages.length).toBe(4)
  })

  //************* Messages ********************
  it('should call save history once on real message movements', () => {
    prepareCpWith4Messages()
    const msgs = kemlService.conversation.author.messages
    const msg0 = msgs[0]
    const msg1 = msgs[1]
    const msg3 = msgs[3]
    const convBefore = kemlService.conversation
      // isMoveUp/Down
    let res0 = kemlService.isMoveDownDisabled(msg3)
    expect(res0).toBeTrue()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    let res1 = kemlService.isMoveDownDisabled(msg1)
    expect(res1).toBeFalse()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    res0 = kemlService.isMoveUpDisabled(msg1)
    expect(res0).toBeFalse()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    res1 = kemlService.isMoveUpDisabled(msg0)
    expect(res1).toBeTrue()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
      // moveMessageUp/Down not possible => no history:
    kemlService.moveMessageUp(msg0)
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation).toEqual(convBefore)
    kemlService.moveMessageDown(msg3)
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation).toEqual(convBefore)
      // move Message up/down possible => history:
    expect(msg3.timing).toBe(3)
    kemlService.moveMessageUp(msg3)
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())
    expect(msg3.timing).toBe(2)
    kemlService.moveMessageDown(msg3)
    expect(historyStub.save).toHaveBeenCalledTimes(2)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())
    expect(kemlService.conversation).toEqual(convBefore)

    kemlService.changeMessagePos(msg1, 3)
    expect(historyStub.save).toHaveBeenCalledTimes(3)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())
    expect(msg1.timing).toBe(3)
  })

  it('should delete a message', () => {
    prepareCpWith4Messages()
    const msgs = kemlService.conversation.author.messages
    const m0 = msgs[0]
    const m1 = msgs[1]
    const m2 = msgs[2]
    const m3 = msgs[3]
    expect(m0.timing).toBe(0)
    expect(m1.timing).toBe(1)
    expect(m2.timing).toBe(2)
    expect(m3.timing).toBe(3)
    kemlService.deleteMessage(m1)
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())
    expect(kemlService.conversation.author.messages.length).toBe(3)
    expect(kemlService.conversation.author.messages.map(m => m.content)).toEqual([
        "message0", "message2", "message3"
    ])
    expect(m0.timing).toBe(0)
    expect(m2.timing).toBe(1)
    expect(m3.timing).toBe(2)
  })

  it('should call history once when duplicating a msg and not if duplication not possible', () => {
    prepareCpWith4Messages()
    const msgs = kemlService.conversation.author.messages
    const m0 = msgs[0]
    const m1 = msgs[1]
    const m2 = msgs[2]
    const m3 = msgs[3]
    // manipulate timing:
    m1.timing = 42
    const m1NoDup = kemlService.duplicateMessage(m1)
    expect(m1NoDup).toBeUndefined()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    m1.timing = 1
    const m1Dup = kemlService.duplicateMessage(m1)
    expect(m1Dup).toBeDefined()
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())
    expect(kemlService.conversation.author.messages.length).toBe(5)
    expect(m0.timing).toBe(0)
    expect(m1.timing).toBe(1)
    expect(m1Dup?.timing).toBe(2)
    expect(m2.timing).toBe(3)
    expect(m3.timing).toBe(4)
    expect(kemlService.conversation.author.messages.map(m => m.content)).toEqual([
      "message0", "message1", "Duplicate of message1", "message2", "message3"
    ])
  })

  it('should call history on real add, but not if not possible or on disabled calls', () => {
    let res = kemlService.isAddNewMessageDisabled()
    expect(res).toBeTrue()
    expect(historyStub.save).toHaveBeenCalledTimes(0)

    const noMsg = kemlService.addNewMessage(true)
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(noMsg).toBeUndefined()

    // now we add cps, hence message creation is now possible:
    const cp0 = prepareCpWith4Messages()
    expect(historyStub.save).toHaveBeenCalledTimes(0)

    res = kemlService.isAddNewMessageDisabled()
    expect(res).toBeFalse()
    expect(historyStub.save).toHaveBeenCalledTimes(0)

    const cp1 = kemlService.addNewConversationPartnerNoHistory("cp1")
    kemlService.moveConversationPartnerLeft(cp1)
    // two partners to also test choice on message when not specified (should be leftmost)
    expect(historyStub.save).toHaveBeenCalledTimes(1)

    // add new msg with cp1 (since now first)
    const msgNoExplicitCp = kemlService.addNewMessageNoHistory(true, undefined, "msgNew0")
    expect(msgNoExplicitCp).toBeDefined()
    expect(msgNoExplicitCp?.timing).toBe(4)
    expect(msgNoExplicitCp?.counterPart.name).toBe("cp1")
    expect(kemlService.conversation.author.messages.map(m => m.content)).toEqual([
      "message0", "message1", "message2", "message3", "msgNew0"
    ])
    expect(historyStub.save).toHaveBeenCalledTimes(1)

    const msgExplicitCp = kemlService.addNewMessage(true, cp0, "msgNew1")
    expect(msgExplicitCp).toBeDefined()
    expect(msgExplicitCp?.timing).toBe(5)
    expect(msgExplicitCp?.counterPart.name).toBe("cp0")
    expect(kemlService.conversation.author.messages.map(m => m.content)).toEqual([
      "message0", "message1", "message2", "message3", "msgNew0", "msgNew1"
    ])
    expect(historyStub.save).toHaveBeenCalledTimes(2)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())
  })

  it('should call history on repetition changes', () => {
    const cp0 = kemlService.addNewConversationPartnerNoHistory("cp0")
    const m1: ReceiveMessage = kemlService.addNewMessageNoHistory(false, cp0, "m1") as ReceiveMessage
    const m3: ReceiveMessage = kemlService.addNewMessageNoHistory(false, cp0, "m3") as ReceiveMessage

    let n0 = new NewInformation(m1, "i0")
    let n1 = new NewInformation(m3, "i1")

    let convInit = kemlService.conversation

    expect(historyStub.save).toHaveBeenCalledTimes(0)
    kemlService.addRepetition(m1, n0)
    kemlService.addRepetition(m1, n1)
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation).toBe(convInit)

    kemlService.addRepetition(m3, n0)
    expect(m3.repeats.length).toBe(1)
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())

    kemlService.deleteRepetition(m3, n0)
    expect(m3.repeats.length).toBe(0)
    expect(historyStub.save).toHaveBeenCalledTimes(2)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())
    expect(kemlService.conversation).toBe(convInit)

    // new deletion is not possible, hence no new triggering of removal
    kemlService.deleteRepetition(m3, n0)
    expect(historyStub.save).toHaveBeenCalledTimes(2)
    expect(kemlService.conversation).toBe(convInit)
  })

  it('should call history on usage changes', () => {
    const cp0 = kemlService.addNewConversationPartnerNoHistory("cp0")
    const m0: SendMessage = kemlService.addNewMessageNoHistory(true, cp0, "m0") as SendMessage
    kemlService.addNewMessageNoHistory(false, cp0, "m1")
    const m2: SendMessage = kemlService.addNewMessageNoHistory(true, cp0, "m2") as SendMessage
    const m3: ReceiveMessage = kemlService.addNewMessageNoHistory(false, cp0, "m3") as ReceiveMessage
    const m4: SendMessage = kemlService.addNewMessageNoHistory(true, cp0, "m4") as SendMessage

    let n1 = new NewInformation(m3, "i1")

    let pre0 = new Preknowledge("pre0")

    let convInit = kemlService.conversation

    expect(historyStub.save).toHaveBeenCalledTimes(0)
    // not working add:
    kemlService.addUsage(m2, n1)
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation).toBe(convInit)
    // working add:
    kemlService.addUsage(m4, n1)
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())
    expect(m4.uses).toContain(n1)
    expect(n1.isUsedOn).toContain(m4)
    //also add usage for preknowledge (always working):
    kemlService.addUsage(m4, pre0)
    expect(m4.uses).toContain(pre0)
    expect(m4.uses.length).toBe(2)
    expect(pre0.isUsedOn).toContain(m4)
    expect(pre0.getTiming()).toBe(4)
    expect(historyStub.save).toHaveBeenCalledTimes(2)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())
    kemlService.addUsage(m0, pre0) //earlier one, makes new first usage
    expect(m0.uses).toContain(pre0)
    expect(pre0.isUsedOn).toContain(m0)
    expect(pre0.getTiming()).toBe(0)
    expect(historyStub.save).toHaveBeenCalledTimes(3)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())

    //delete usage on pre:
    kemlService.deleteUsage(m4, pre0)
    expect(historyStub.save).toHaveBeenCalledTimes(4)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())
    expect(m4.uses).toContain(n1)
    expect(m4.uses.length).toBe(1)
    expect(pre0.isUsedOn).toContain(m0)
    expect(pre0.isUsedOn.length).toBe(1)
    kemlService.deleteUsage(m0, pre0)
    expect(historyStub.save).toHaveBeenCalledTimes(5)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())
    expect(m4.uses).toContain(n1)
    expect(m4.uses.length).toBe(1)
    expect(pre0.isUsedOn.length).toBe(0)

    // delete usage on new:
    kemlService.deleteUsage(m4, n1)
    expect(historyStub.save).toHaveBeenCalledTimes(6)
    expect(historyStub.save).toHaveBeenCalledWith(convInit.toJson())
    expect(kemlService.conversation).toBe(convInit)
    // new deletion is not possible, hence no new triggering of removal
    kemlService.deleteUsage(m4, n1)
    expect(historyStub.save).toHaveBeenCalledTimes(6)
    expect(kemlService.conversation).toBe(convInit)
  })

  //************** Infos ************************
  it('should change a new info\'s source and call history', () => {
    const cp = kemlService.addNewConversationPartnerNoHistory()

    const msg1: ReceiveMessage = kemlService.addNewMessageNoHistory(false, cp, "rec1") as ReceiveMessage
    const msg2: ReceiveMessage = kemlService.addNewMessageNoHistory(false, cp, "rec2") as ReceiveMessage
    let newInfo = new NewInformation(msg2, 'newInfo', false)
    expect(msg1.generates.length).toEqual(0)
    expect(msg2.generates.length).toEqual(1)
    expect(newInfo.source).toEqual(msg2)
    expect(historyStub.save).toHaveBeenCalledTimes(0)

    // call to test:
    kemlService.changeInfoSource(newInfo, msg1)
    expect(msg1.generates.length).toEqual(1)
    expect(msg2.generates.length).toEqual(0)
    expect(newInfo.source).toEqual(msg1)
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())
  })

  it('should add a new preknowledge (with history)', () => {
    let p0 = kemlService.addNewPreknowledge()
    expect(kemlService.conversation.author.preknowledge.length).toEqual(1)
    expect(kemlService.conversation.author.preknowledge).toContain(p0)
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())
  })

  it('should add a new new information (with history only if possible) and check for the ability (without history)', () => {
    const cp0 = kemlService.addNewConversationPartnerNoHistory("cp0")
    const initialConv = kemlService.conversation
    const res0 = kemlService.isAddNewNewInfoDisabled()
    expect(res0).toBeTrue()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    //add call (not possible):
    const noN = kemlService.addNewNewInfo()
    expect(noN).toBeUndefined()
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    expect(kemlService.conversation).toBe(initialConv)

    // add one receive, now new info creation is possible:
    const rec0: ReceiveMessage = kemlService.addNewMessageNoHistory(false, cp0, "rec0") as ReceiveMessage
    expect(historyStub.save).toHaveBeenCalledTimes(0)
    const res1 = kemlService.isAddNewNewInfoDisabled()
    expect(res1).toBeFalse()
    expect(historyStub.save).toHaveBeenCalledTimes(0)

    const n0 = kemlService.addNewNewInfo(rec0)
    expect(n0).toBeDefined()
    expect(rec0.generates).toContain(n0!)
    expect(historyStub.save).toHaveBeenCalledOnceWith(kemlService.conversation.toJson())
  })

  it('should delete an info (with history)', () => {
    let p0 = kemlService.addNewPreknowledge()
    expect(kemlService.conversation.author.preknowledge).toContain(p0)
    expect(kemlService.conversation.author.preknowledge.length).toBe(1)
    const cp0 = kemlService.addNewConversationPartnerNoHistory("cp0")
    const rec0: ReceiveMessage = kemlService.addNewMessageNoHistory(false, cp0, "rec0") as ReceiveMessage
    const n0: NewInformation = kemlService.addNewNewInfo(rec0) as NewInformation
    expect(n0).toBeDefined()
    expect(rec0.generates).toContain(n0!)
    expect(rec0.generates.length).toBe(1)
    expect(historyStub.save).toHaveBeenCalledTimes(2)

    kemlService.deleteInfo(p0)
    expect(kemlService.conversation.author.preknowledge.length).toBe(0)
    expect(historyStub.save).toHaveBeenCalledTimes(3)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())

    kemlService.deleteInfo(p0)
    expect(historyStub.save).toHaveBeenCalledTimes(3)

    kemlService.deleteInfo(n0)
    expect(rec0.generates.length).toBe(0)
    expect(historyStub.save).toHaveBeenCalledTimes(4)
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.conversation.toJson())

    kemlService.deleteInfo(n0)
    expect(rec0.generates.length).toBe(0)
    expect(historyStub.save).toHaveBeenCalledTimes(4)

    const p1 = new Preknowledge("Not contained")
    expect(historyStub.save).toHaveBeenCalledTimes(4)
    kemlService.deleteInfo(p1)
    expect(historyStub.save).toHaveBeenCalledTimes(4)

    /*
    // since rec exists, call works:
    const rec2 = new ReceiveMessage(cp0, 5, "not contained")
    const n1 = new NewInformation(rec2, "Not contained")
    expect(historyStub.save).toHaveBeenCalledTimes(4)
    kemlService.deleteInfo(n1)
    expect(historyStub.save).toHaveBeenCalledTimes(5)*/
  })

});
