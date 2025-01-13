export interface ChatGptMessage {
  content: ChatGptMessageContent;
}

export interface ChatGptMessageContent {
  content_type: string;
  parts: string[];
  author: ChatGptAuthor;

}

export interface ChatGptAuthor {
  role: string; //assistant for LLM, other entry is Author
}
