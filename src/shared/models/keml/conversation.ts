import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "./json/sequence-diagram-models";
import {Parser} from "../parser/parser";
import {Ref} from "../parser/ref";
import {Referencable} from "../parser/referenceable";


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
    parser?: Parser,
  ) {
    super();
    this.ref = new Ref(Conversation.ownPath, this.eClass)
    if (parser) {
      let convJson: ConversationJson = parser?.getJsonFromTree(this.ref.$ref)
      parser.put(this)
      this.title = convJson.title;
      const authorRef = Parser.createSingleRef(Conversation.ownPath, Conversation.authorPrefix, Author.eClass)
      this.author = parser.getOrCreate<Author>(authorRef);
      const cpRefs: Ref[] = Parser.createRefList(Conversation.ownPath, Conversation.conversationPartnersPrefix, convJson.conversationPartners.map(_ => ConversationPartner.eClass))
      this.conversationPartners = cpRefs.map( cp => parser.getOrCreate<ConversationPartner>(cp))
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
    let context = new Parser(conv);
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
