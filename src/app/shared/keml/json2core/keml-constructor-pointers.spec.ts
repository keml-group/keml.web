import { KEMLConstructorPointers } from './keml-constructor-pointers';
import {Deserializer} from "emfular";

describe('KEMLConstructorPointers', () => {
  it('should create an instance', () => {
    expect(new KEMLConstructorPointers()).toBeTruthy();
  });

  it('should parse into the expected object', () => {
    let json = "{\n" +
      "  \"eClass\": \"http://www.unikoblenz.de/keml#//Conversation\",\n" +
      "  \"title\": \"New Conversation\",\n" +
      "  \"conversationPartners\": [\n" +
      "    {\n" +
      "      \"eClass\": \"http://www.unikoblenz.de/keml#//ConversationPartner\",\n" +
      "      \"name\": \"New Partner\",\n" +
      "      \"xPosition\": 300\n" +
      "    }\n" +
      "  ],\n" +
      "  \"author\": {\n" +
      "    \"eClass\": \"http://www.unikoblenz.de/keml#//Author\",\n" +
      "    \"name\": \"Author\",\n" +
      "    \"xPosition\": 0,\n" +
      "    \"messages\": [\n" +
      "      {\n" +
      "        \"content\": \"New send content\",\n" +
      "        \"counterPart\": {\n" +
      "          \"$ref\": \"//@conversationPartners.0\",\n" +
      "          \"eClass\": \"http://www.unikoblenz.de/keml#//ConversationPartner\"\n" +
      "        },\n" +
      "        \"eClass\": \"http://www.unikoblenz.de/keml#//SendMessage\",\n" +
      "        \"originalContent\": \"Original content\",\n" +
      "        \"timing\": 0,\n" +
      "        \"uses\": []\n" +
      "      },\n" +
      "      {\n" +
      "        \"content\": \"New receive content\",\n" +
      "        \"counterPart\": {\n" +
      "          \"$ref\": \"//@conversationPartners.0\",\n" +
      "          \"eClass\": \"http://www.unikoblenz.de/keml#//ConversationPartner\"\n" +
      "        },\n" +
      "        \"eClass\": \"http://www.unikoblenz.de/keml#//ReceiveMessage\",\n" +
      "        \"originalContent\": \"Original content\",\n" +
      "        \"timing\": 1,\n" +
      "        \"generates\": [],\n" +
      "        \"repeats\": []\n" +
      "      },\n" +
      "      {\n" +
      "        \"content\": \"New receive content\",\n" +
      "        \"counterPart\": {\n" +
      "          \"$ref\": \"//@conversationPartners.0\",\n" +
      "          \"eClass\": \"http://www.unikoblenz.de/keml#//ConversationPartner\"\n" +
      "        },\n" +
      "        \"eClass\": \"http://www.unikoblenz.de/keml#//ReceiveMessage\",\n" +
      "        \"originalContent\": \"Original content\",\n" +
      "        \"timing\": 2,\n" +
      "        \"generates\": [],\n" +
      "        \"repeats\": [\n" +
      "          {\n" +
      "            \"$ref\": \"//@author/@preknowledge.0\",\n" +
      "            \"eClass\": \"http://www.unikoblenz.de/keml#//PreKnowledge\"\n" +
      "          }\n" +
      "        ]\n" +
      "      },\n" +
      "      {\n" +
      "        \"content\": \"New send content\",\n" +
      "        \"counterPart\": {\n" +
      "          \"$ref\": \"//@conversationPartners.0\",\n" +
      "          \"eClass\": \"http://www.unikoblenz.de/keml#//ConversationPartner\"\n" +
      "        },\n" +
      "        \"eClass\": \"http://www.unikoblenz.de/keml#//SendMessage\",\n" +
      "        \"originalContent\": \"Original content\",\n" +
      "        \"timing\": 3,\n" +
      "        \"uses\": []\n" +
      "      }\n" +
      "    ],\n" +
      "    \"preknowledge\": [\n" +
      "      {\n" +
      "        \"causes\": [],\n" +
      "        \"currentTrust\": 0.5,\n" +
      "        \"eClass\": \"\",\n" +
      "        \"initialTrust\": 0.5,\n" +
      "        \"feltTrustImmediately\": 0.5,\n" +
      "        \"feltTrustAfterwards\": 0.5,\n" +
      "        \"isInstruction\": false,\n" +
      "        \"isUsedOn\": [],\n" +
      "        \"message\": \"New preknowledge\",\n" +
      "        \"repeatedBy\": [\n" +
      "          {\n" +
      "            \"$ref\": \"//@author/@messages.2\",\n" +
      "            \"eClass\": \"http://www.unikoblenz.de/keml#//ReceiveMessage\"\n" +
      "          }\n" +
      "        ],\n" +
      "        \"targetedBy\": [],\n" +
      "        \"position\": {\n" +
      "          \"x\": -300,\n" +
      "          \"y\": 50,\n" +
      "          \"w\": 200,\n" +
      "          \"h\": 50\n" +
      "        }\n" +
      "      }\n" +
      "    ]\n" +
      "  }\n" +
      "}"
    let convJson = JSON.parse(json);
    expect(new Deserializer(convJson)).toBeTruthy();
  })
});
