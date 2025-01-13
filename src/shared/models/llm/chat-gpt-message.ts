export interface ChatGptMessage {
  author: ChatGptAuthor;
  content: ChatGptMessageContent;
}

export interface ChatGptMessageContent {
  content_type: string;
  parts: string[];
}

export interface ChatGptAuthor {
  role: string; //assistant for LLM, other entry is Author
}
