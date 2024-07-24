import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {IOHelper} from "./iohelper";

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

  static fromJSON (json: string): Conversation {
    let conv =  <Conversation>JSON.parse(json);

    //resolve conv Partner refs
    let convPartners = conv.conversationPartners;
    conv.author.messages?.forEach(message => {
      let ref = message.counterPart.$ref; //todo is correct because references are not correctly parsed now
      message.counterPart = convPartners[IOHelper.resolveConversationPartnerReference(ref? ref : "")];
    })
    // todo resolve others
    return Object.assign(new Conversation(), conv);
  }
}
