import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {Deserializer, Ref, Referencable, RefHandler, ReferencableTreeSingletonContainer} from "emfular";
import {KEMLConstructorPointers} from "@app/shared/keml/json2core/keml-constructor-pointers";
import {EClasses} from "@app/shared/keml/eclasses";


export class Conversation extends Referencable {
  static readonly ownPath: string = '/'
  static readonly authorPrefix = 'author';
  static readonly conversationPartnersPrefix = 'conversationPartners';
  title: string;
  _author: ReferencableTreeSingletonContainer<Author>;
  get author(): Author {
    return this._author.get()!!
  }
  set author(author: Author) {
    this._author.add(author);
  }
  conversationPartners: ConversationPartner[] = [];

  constructor(
    title: string = 'New Conversation',
    author: Author = new Author(),
    deserializer?: Deserializer,
  ) {
    let ref = RefHandler.createRef(Conversation.ownPath, EClasses.Conversation)
    super(ref);
    this._author = new ReferencableTreeSingletonContainer<Author>(this, Conversation.authorPrefix);
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

  static fromJSON (convJson: ConversationJson): Conversation {
    let context = new Deserializer(convJson, KEMLConstructorPointers.getConstructorPointers());
    let ref: Ref = {
      $ref: Conversation.ownPath,
      eClass: EClasses.Conversation
    }
    let conv = this.createTreeBackbone(ref, context);
    context.addAllReferences()
    return conv;
  }

  static createTreeBackbone(ref: Ref, context: Deserializer): Conversation {
    let convJson: ConversationJson = context.getJsonFromTree(ref.$ref);
    let conv = new Conversation(convJson.title)
    context.put(conv)
    //trigger children:
    convJson.conversationPartners.map((_, i) => {
      let newRefRef = RefHandler.mixWithPrefixAndIndex(ref.$ref, Conversation.conversationPartnersPrefix, i)
      let newRef: Ref = RefHandler.createRef(newRefRef, EClasses.ConversationPartner)
      let cp = ConversationPartner.createTreeBackbone(newRef, context)
      conv.addCP(cp)
    })
    let authorRefRef = RefHandler.computePrefix(ref.$ref, Conversation.authorPrefix)
    let authorRef: Ref = {$ref: authorRefRef, eClass: EClasses.Author}
    conv.author = Author.createTreeBackbone(authorRef, context)
    return conv;
  }

}
