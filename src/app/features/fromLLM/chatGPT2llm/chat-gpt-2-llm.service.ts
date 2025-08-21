import {LLMMessage, LLMMessageAuthorType} from "@app/features/fromLLM/llm2keml/llm.models";
import {ChatGptAuthor, ChatGptMessage} from "@app/features/fromLLM/chatGPT2llm/chat-gpt.models";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ChatGpt2LlmService {

  separateConvs(convs: string): any[] {
    return (JSON.parse(convs) as any[]);
  }

  getTitlesFromJsonArray(convJson: any[]) {
    return convJson.map(entry => entry['title'])
  }

  parseConversationJSON(convJson: any): LLMMessage[] {
    return this.parseMessageMapping(convJson['mapping'], convJson['current_node'])
  }

  private parseMessageMapping(mapping: any, startId: string): LLMMessage[] {
    const res: LLMMessage[] = [];
    let currentId: string | undefined = startId;
    while (currentId !== undefined) {
      let node: any = mapping[currentId]
      if (node){
        currentId  = node['parent']
        let msg: ChatGptMessage = node['message'] as ChatGptMessage;
        if (msg
          && msg.content
          && msg.content.content_type == 'text'
          && msg.content.parts?.length >0
          && msg.content.parts[0]?.length >0) {
          res.push(new LLMMessage(
            this.parseAuthor(msg.author),
            msg.content.parts[0]
          ))
        }
      } else {
        currentId = undefined
      }
    }
    return res.reverse();
  }

  private parseAuthor(author: ChatGptAuthor): LLMMessageAuthorType {
    if (author.role == 'assistant') return LLMMessageAuthorType.LLM
    else return LLMMessageAuthorType.Author
  }
}
