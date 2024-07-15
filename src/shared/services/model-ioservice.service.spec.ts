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
    let text = "{\n" +
      "  \"eClass\" : \"http://www.unikoblenz.de/keml#//Conversation\",\n" +
      "  \"title\" : \"2-1 modified\",\n" +
      "  \"author\" : {\n" +
      "    \"messages\" : [ {\n" +
      "      \"eClass\" : \"http://www.unikoblenz.de/keml#//SendMessage\",\n" +
      "      \"content\" : \"Can you find repositories that use log4j from github\",\n" +
      "      \"counterPart\" : {\n" +
      "        \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "        \"$ref\" : \"//@conversationPartners.0\"\n" +
      "      }\n" +
      "    } ]" +
      "},\n" +
      "  \"conversationPartners\" : [ {\n" +
      "    \"eClass\" : \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "    \"name\" : \"LLM\"\n" +
      "  } ]\n" +
      "}";
    let conv: Conversation = service.loadKEML(text);
    expect(conv).toBeDefined();
    expect(conv.title).toEqual("2-1 modified");
    expect(conv.conversationPartners?.at(0)?.name).toEqual("LLM");
    // todo: neither toBe nor the weaker toEqual because ref is not correctly deserialized
    expect(conv.author?.messages?.at(0)?.counterPart).toBe(conv.conversationPartners?.at(0)) // reference not treated correctly -> no understanding so far
  });
});
