import { TestBed } from '@angular/core/testing';

import { ModelIOServiceService } from './model-ioservice.service';
import {Conversation} from "../models/sequence-diagram-models";

describe('ModelIOServiceService', () => {
  let service: ModelIOServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelIOServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse a json into a conversation', () => {
    let info1a = " {\n" +
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

    let msg1 = "";
    let text = "{\n" +
      "  \"eClass\" : \"http://www.unikoblenz.de/keml#//Conversation\",\n" +
      "  \"title\" : \"Test-Conv\",\n" +
      "  \"author\" : {\n" +
      "    \"messages\" : [ " +
      "      {\n" +
      "      \"eClass\" : \"http://www.unikoblenz.de/keml#//SendMessage\",\n" +
      "      \"content\" : \"question1\",\n" +
      "      \"timing\" : 1,\n" +
      "      \"counterPart\" : {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "        \"$ref\" : \"//@conversationPartners.0\"\n" +
      "         },\n" +
      "      \"originalContent\" : \"long question1\",\n" +
      "      \"generates\" : [ " +
      info1a +
      "       ]" +
      "      },\n" +
      "      {\n" +
      "      \"eClass\" : \"http://www.unikoblenz.de/keml#//ReceiveMessage\",\n" +
      "      \"content\" : \"answer1\",\n" +
      "      \"timing\" : 2,\n" +
      "      \"counterPart\" : {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "        \"$ref\" : \"//@conversationPartners.0\"\n" +
      "         },\n" +
      "      \"originalContent\" : \"long answer1\"\n" +
      "      } " +
      "]" +
      "},\n" +
      "  \"conversationPartners\" : [ " +
      "     {\n" +
      "     \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "     \"name\" : \"LLM\"\n" +
      "     }," +
      "     {\n" +
      "     \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "     \"name\" : \"Other\"\n" +
      "     }" +
      " ]\n" +
      "}";
    let conv: Conversation = service.loadKEML(text);
    expect(conv).toBeDefined();
    expect(conv.title).toEqual("Test-Conv");
    expect(conv.conversationPartners?.at(0)?.name).toEqual("LLM");
    expect(conv.conversationPartners?.at(1)?.name).toEqual("Other");
    expect(conv.author?.messages?.at(0)?.counterPart).toBe(conv.conversationPartners?.at(0))
  });
});
