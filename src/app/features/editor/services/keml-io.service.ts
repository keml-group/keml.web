import { Injectable } from '@angular/core';
import {ModelIOService} from "@app/features/editor/services/model-io.service";
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {ConversationJson} from "@app/shared/keml/models/json/sequence-diagram-models";
import {JsonFixer} from "@app/shared/keml/models/json2core/json-fixer";
import {LayoutHelper} from "@app/features/editor/utils/layout-helper";
import {LLMMessage} from "@app/features/editor/fromLLM/models/llmmessage";
import {LlmConversationCreator} from "@app/features/editor/fromLLM/utils/llm-conversation-creator";

@Injectable({
  providedIn: 'root'
})
export class KEMLIOService {
  // responsible for KEML laod and save:
  // it delegates the conversation

  constructor(
    public modelIOService: ModelIOService
  ) {}

  newKEML(): Conversation {
    const conv = new Conversation();
    LayoutHelper.positionConversationPartners(conv.conversationPartners)
    this.modelIOService.assignConversation(conv) ;
    return conv;
  }


  loadKEML(json: string): Conversation {
    let convJson =  <ConversationJson>JSON.parse(json);
    JsonFixer.prepareJsonInfoLinkSources(convJson);
    JsonFixer.addMissingSupplementType(convJson);

    let conv = Conversation.fromJSON(convJson);
    LayoutHelper.positionConversationPartners(conv.conversationPartners)
    LayoutHelper.timeMessages(conv.author.messages)
    LayoutHelper.positionInfos(conv.author.preknowledge, conv.author.messages);

    this.modelIOService.assignConversation(conv) ;
    return conv;
  }

  convFromLlmMessages(llmMsgs: LLMMessage[]): Conversation {
    let conversation = LlmConversationCreator.convFromLlmMessages(llmMsgs)
    this.modelIOService.assignConversation(conversation) ;
    return conversation;
  }

  saveKEML(conv: Conversation): string {
    let convJson = conv.toJson()
    return JSON.stringify(convJson);
  }

}
