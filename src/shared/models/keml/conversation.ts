import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";

export class Conversation {
  eClass ='http://www.unikoblenz.de/keml#//Conversation';
  title: string;
  author: Author;
  conversationPartners: ConversationPartner[] = [];

  constructor(
    title: string = 'New Conversation',
    author: Author = new Author(),
    conversationPartners: ConversationPartner[] = []
  ) {
    this.title = title;
    this.author = author;
    this.conversationPartners = conversationPartners;
  }
}
