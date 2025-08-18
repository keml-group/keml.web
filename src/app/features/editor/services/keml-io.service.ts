import { Injectable } from '@angular/core';
import {KemlService} from "@app/features/editor/services/keml.service";
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {ConversationJson} from "@app/shared/keml/models/json/sequence-diagram-models";
import {JsonFixer} from "@app/shared/keml/models/json2core/json-fixer";
import {LayoutHelper} from "@app/features/editor/utils/layout-helper";
import {LLMMessage} from "@app/features/editor/fromLLM/models/llmmessage";
import {LlmConversationCreator} from "@app/features/editor/fromLLM/utils/llm-conversation-creator";
import {IoService} from "ngx-emfular-helper";

@Injectable({
  providedIn: 'root'
})
export class KEMLIOService {
  // responsible for KEML laod and save:
  // it delegates the conversation

  constructor(
    private kemlService: KemlService,
    private ioService: IoService,
  ) {}

  newKEML(): Conversation {
    const conv = new Conversation();
    LayoutHelper.positionConversationPartners(conv.conversationPartners)
    this.kemlService.assignConversation(conv) ;
    return conv;
  }

  loadKEMLfromFile(event: Event) {
    this.ioService.loadStringFromFile(event).then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      this.loadKEML(txt);
    });
  }

  loadKEML(json: string): Conversation {
    let convJson =  <ConversationJson>JSON.parse(json);
    JsonFixer.prepareJsonInfoLinkSources(convJson);
    JsonFixer.addMissingSupplementType(convJson);

    let conv = Conversation.fromJSON(convJson);
    LayoutHelper.positionConversationPartners(conv.conversationPartners)
    LayoutHelper.timeMessages(conv.author.messages)
    LayoutHelper.positionInfos(conv.author.preknowledge, conv.author.messages);

    this.kemlService.assignConversation(conv) ;
    return conv;
  }

  convFromLlmMessages(llmMsgs: LLMMessage[]): Conversation {
    let conversation = LlmConversationCreator.convFromLlmMessages(llmMsgs)
    this.kemlService.assignConversation(conversation) ;
    return conversation;
  }

  saveKEML() {
    const conv = this.kemlService.conversation;
    const jsonString = JSON.stringify(conv.toJson());
    this.ioService.saveJson(jsonString, conv.title)
  }

}
