import {LLMMessage, LLMMessageAuthorType} from "./llmmessage";
import {ChatGptAuthor, ChatGptMessage} from "./chat-gpt-message";

export class ChatGptConv2LlmMessages {

  static parseConversation(conv: string): LLMMessage[] {
    let convJson = JSON.parse(conv);
    return this.parseMessageMapping(convJson['mapping'], convJson['current_node'])
  }

  private static parseMessageMapping(mapping: any, startId: string): LLMMessage[] {
    const res: LLMMessage[] = [];
    let currentId: string | undefined = startId;
    while (currentId !== undefined) {
      let node: any = mapping[currentId]
      let msg: ChatGptMessage = JSON.parse(node['message'])
      if (msg
        && msg.content?.content_type == 'text'
        && msg.content?.parts[0]?.length >0) {
        res.push(
          new LLMMessage(
            this.parseAuthor(msg.content.author),
            msg.content.parts[0]
          )
        )
      }
      currentId  = node['parent']
    }
    return res.reverse();
  }

  private static parseAuthor(author: ChatGptAuthor): LLMMessageAuthorType {
    if (author.role == 'assistant') return LLMMessageAuthorType.LLM
    else return LLMMessageAuthorType.Author
  }
}
