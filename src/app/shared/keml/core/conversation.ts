import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {Deserializer, Ref, Referencable} from "emfular";
import {KEMLConstructorPointers} from "@app/shared/keml/json2core/keml-constructor-pointers";
import {EClasses} from "@app/shared/keml/eclasses";
import {RefHandler} from "emfular";


export class Conversation extends Referencable {
  static readonly ownPath: string = '/'
  title: string;
  static readonly authorPrefix = 'author';
  author: Author;
  static readonly conversationPartnersPrefix = 'conversationPartners';
  conversationPartners: ConversationPartner[] = [];

  constructor(
    title: string = 'New Conversation',
    author: Author = new Author(),
    deserializer?: Deserializer,
  ) {
    let ref = RefHandler.createRef(Conversation.ownPath, EClasses.Conversation)
    super(ref);
    if (deserializer) {
      let convJson: ConversationJson = deserializer.getJsonFromTree(this.ref.$ref)
      deserializer.put(this)
      this.title = convJson.title;
      const authorRef = Deserializer.createSingleRef(Conversation.ownPath, Conversation.authorPrefix, EClasses.Author)
      this.author = deserializer.getOrCreate<Author>(authorRef);
      const cpRefs: Ref[] = Deserializer.createRefList(Conversation.ownPath, Conversation.conversationPartnersPrefix, convJson.conversationPartners.map(_ => EClasses.ConversationPartner))
      this.conversationPartners = cpRefs.map( cp => deserializer.getOrCreate<ConversationPartner>(cp))
    } else {
      this.title = title;
      this.author = author;
    }
    this.singleChildren.set(Conversation.authorPrefix, this.author)
    this.listChildren.set(Conversation.conversationPartnersPrefix, this.conversationPartners)
  }

  addCP(...cps: ConversationPartner[]) {
    cps.map(cp => this.conversationPartners.push(cp))
  }

  toJson(): ConversationJson {
    this.prepare('/');
    let cps = this.conversationPartners.map(x => x.toJson())

    return {
      eClass: this.ref.eClass,
      title: this.title,
      conversationPartners: cps,
      author: this.author.toJson(),
    };
  }

  static fromJSON (conv: ConversationJson): Conversation {
    let context = new Deserializer(conv, KEMLConstructorPointers.getConstructorPointers());
    return new Conversation(undefined, undefined, context)
  }
}
