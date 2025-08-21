import {LLMMessage, LLMMessageAuthorType} from "@app/features/fromLLM/llm2keml/llm.models";
import {Injectable} from "@angular/core";
import {KemlService} from "@app/shared/keml/core/keml.service";

@Injectable({
  providedIn: 'root'
})
export class Llm2KemlService {

  constructor(
    private kemlService: KemlService,
  ) {}

  convFromLlmMessages(llmMsgs: LLMMessage[]): void {
    this.kemlService.newConversation('From model')
    let llm = this.kemlService.addNewConversationPartner('LLM')
    for( let i=0; i < llmMsgs.length; i++) {
      this.kemlService.addNewMessage(
        Llm2KemlService.isSend(llmMsgs[i]),
        llm,
        llmMsgs[i].message,
        llmMsgs[i].message,
      )
    }
  }

  private static isSend(llmMsg: LLMMessage): boolean {
    return llmMsg.author != LLMMessageAuthorType.LLM
  }
}
