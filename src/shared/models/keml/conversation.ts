import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {Conversation as ConversationJson} from "../sequence-diagram-models";

export class Conversation {
  readonly eClass ='http://www.unikoblenz.de/keml#//Conversation';
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

  static fromJSON (conv: ConversationJson): Conversation {
    let convPartners: ConversationPartner[] = conv.conversationPartners.map(cp => ConversationPartner.fromJSON(cp))
    let author: Author = Author.fromJson(conv.author, convPartners);

    return new Conversation(conv.title, author, convPartners)
  }
}
