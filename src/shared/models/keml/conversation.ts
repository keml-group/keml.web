import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {IOHelper} from "./iohelper";
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

  // this should get called automatically before stringify acc. to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  toJSON(): Conversation {
    //set Item others can use
    sessionStorage.setItem('conversationPartners', JSON.stringify(this.conversationPartners.map(c => c.name)))
    console.log("Set convPartners for lower levels")
    return this;
  }

  toJson(): string {
    const convP = this.conversationPartners;
    return JSON.stringify(this, (key, value) => {
      console.log(convP);
      if (key == "counterPart") {
        const index = convP.findIndex(v => v.name == value.name);
        value = {
          eClass : "http://www.unikoblenz.de/keml#//ConversationPartner",
            $ref : IOHelper.createConversationPartnerRef(index)
        }
      }
    })
  }

  static fromJSON (conv: ConversationJson): Conversation {
    let convPartners: ConversationPartner[] = conv.conversationPartners.map(cp => ConversationPartner.fromJSON(cp))
    let author: Author = Author.fromJson(conv.author, convPartners);

    return new Conversation(conv.title, author, convPartners)
  }
}
