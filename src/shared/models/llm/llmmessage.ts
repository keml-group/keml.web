export class LLMMessage {
  author: string;
  message: string;

  constructor(author: LLMMessageAuthorType, message: string) {
    this.author = author;
    this.message = message;
  }

}

export enum LLMMessageAuthorType {
  Author = 'Author',
  LLM = 'LLM',
}
