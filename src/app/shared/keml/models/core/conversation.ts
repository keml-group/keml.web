import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "@app/shared/keml/models/json/sequence-diagram-models";
import {Deserializer, Ref, Referencable} from "emfular";
import {KEMLConstructorPointers} from "@app/shared/keml/models/json2core/keml-constructor-pointers";


export class Conversation extends Referencable {
  static readonly ownPath: string = '/'
  static readonly eClass ='http://www.unikoblenz.de/keml#//Conversation';
  title: string;
  static readonly authorPrefix = 'author';
  author: Author;
  static readonly conversationPartnersPrefix = 'conversationPartners';
  conversationPartners: ConversationPartner[] = [];

  constructor(
    title: string = 'New Conversation',
    author: Author = new Author(),
    conversationPartners: ConversationPartner[] = [],
    deserializer?: Deserializer,
  ) {
    let ref = new Ref(Conversation.ownPath, Conversation.eClass)
    super(ref);
    if (deserializer) {
      let convJson: ConversationJson = deserializer.getJsonFromTree(this.ref.$ref)
      deserializer.put(this)
      this.title = convJson.title;
      const authorRef = Deserializer.createSingleRef(Conversation.ownPath, Conversation.authorPrefix, Author.eClass)
      this.author = deserializer.getOrCreate<Author>(authorRef);
      const cpRefs: Ref[] = Deserializer.createRefList(Conversation.ownPath, Conversation.conversationPartnersPrefix, convJson.conversationPartners.map(_ => ConversationPartner.eClass))
      this.conversationPartners = cpRefs.map( cp => deserializer.getOrCreate<ConversationPartner>(cp))
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
      eClass: Conversation.eClass,
      title: this.title,
      conversationPartners: cps,
      author: this.author.toJson(),
    };
  }

  static fromJSON (conv: ConversationJson): Conversation {
    let context = new Deserializer(conv, KEMLConstructorPointers.getConstructorPointers());
    return new Conversation(undefined, undefined, undefined, context)
  }
}
