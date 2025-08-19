import {LLMMessage, LLMMessageAuthorType} from "@app/features/editor/fromLLM/llm2keml/llmmessage";
import {ChatGptAuthor, ChatGptMessage} from "@app/features/editor/fromLLM/chatGPT2llm/chat-gpt-message";

export class ChatGptConv2LlmMessages {

  static separateConvs(convs: string): any[] {
    return (JSON.parse(convs) as any[]);
  }

  static getTitlesFromJsonArray(convJson: any[]) {
    return convJson.map(entry => entry['title'])
  }

  static parseConversationJSON(convJson: any): LLMMessage[] {
    return this.parseMessageMapping(convJson['mapping'], convJson['current_node'])
  }

  private static parseMessageMapping(mapping: any, startId: string): LLMMessage[] {
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

  private static parseAuthor(author: ChatGptAuthor): LLMMessageAuthorType {
    if (author.role == 'assistant') return LLMMessageAuthorType.LLM
    else return LLMMessageAuthorType.Author
  }
}
