import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "../sequence-diagram-models";
import {ParserContext} from "./parser/parser-context";
import {Ref} from "./parser/ref";
import {Referencable} from "./parser/referenceable";


export class Conversation extends Referencable {
  static readonly ownPath: string = '/'
  readonly eClass ='http://www.unikoblenz.de/keml#//Conversation';
  title: string;
  static readonly authorPrefix = 'author';
  author: Author;
  static readonly conversationPartnersPrefix = 'conversationPartners';
  conversationPartners: ConversationPartner[] = [];

  constructor(
    title: string = 'New Conversation',
    author: Author = new Author(),
    conversationPartners: ConversationPartner[] = [],
    parserContext?: ParserContext,
  ) {
    super();
    this.ref = new Ref(Conversation.ownPath, this.eClass)
    if (parserContext) {
      parserContext.put(this)
      this.title = parserContext.conv.title;
      const authorRef = ParserContext.createSingleRef(Conversation.ownPath, Conversation.authorPrefix, Author.eClass)
      this.author = parserContext.getOrCreate<Author>(authorRef);
      const cpRefs: Ref[] = ParserContext.createRefList2(Conversation.ownPath, Conversation.conversationPartnersPrefix, parserContext.conv.conversationPartners.map(_ => ConversationPartner.eClass))
      this.conversationPartners = cpRefs.map( cp => parserContext.getOrCreate<ConversationPartner>(cp))
    } else {
      this.title = title;
      this.author = author;
      this.conversationPartners = conversationPartners;
    }
    this.singleChildren.set(Conversation.authorPrefix, this.author)
    this.listChildren.set(Conversation.conversationPartnersPrefix, this.conversationPartners)
  }

  toJson(): ConversationJson {
    this.prepare('/');
    let cps = this.conversationPartners.map(x => x.toJson())

    return {
      eClass: this.eClass,
      title: this.title,
      conversationPartners: cps,
      author: this.author.toJson(),
    };
  }

  static fromJSON (conv: ConversationJson): Conversation {
    let context = new ParserContext(conv);
    return new Conversation(undefined, undefined, undefined, context)

    /*
    let currentPrefix = '/';
    let convPPrefix = 'conversationPartners';
    let convPartners: ConversationPartner[] = conv.conversationPartners.map(cp => ConversationPartner.fromJSON(cp, context))
    //context.putList(currentPrefix, convPPrefix, convPartners);

    let author: Author = Author.fromJson(conv.author, context);

    return new Conversation(conv.title, author, convPartners)
     */
  }
}
