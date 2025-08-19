import {LLMMessage} from "@app/features/editor/fromLLM/llm2keml/llm.models";
import {Conversation} from "@app/shared/keml/models/core/conversation";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {Author} from "@app/shared/keml/models/core/author";
import {LayoutHelper} from "@app/features/editor/utils/layout-helper";
import {Message} from "@app/shared/keml/models/core/msg-info";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Llm2KemlService {

  static convFromLlmMessages(llmMsgs: LLMMessage[]): Conversation {
    let cp = new ConversationPartner('LLM')
    const conv = new Conversation('From model', new Author(), [cp]);
    LayoutHelper.positionConversationPartners(conv.conversationPartners)
    for( let i=0; i < llmMsgs.length; i++) {
      let msg = this.createMsg(llmMsgs[i], cp, i)
      conv.author.messages.push(msg)
    }
    return conv;
  }

  private static createMsg(llmMsg: LLMMessage,counterPart: ConversationPartner, index: number): Message {
    return Message.newMessage(this.isSend(llmMsg), counterPart, index, llmMsg.message, llmMsg.message)
  }

  private static isSend(llmMsg: LLMMessage): boolean {
    return llmMsg.author != 'LLM'
  }
}
