import {Conversation} from "@app/shared/keml/models/core/conversation";
import {Author} from "@app/shared/keml/models/core/author";

export class IncrementalSimulator {

  completeConv: Conversation
  incrementalConv: Conversation

  constructor(public conv: Conversation) {
    this.completeConv = conv;
    let author = new Author(conv.author.name, conv.author.xPosition)
    this.incrementalConv = new Conversation(conv.title, author, conv.conversationPartners)
  }

  

}
