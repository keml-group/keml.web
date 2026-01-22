import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {Deserializer, Ref, Referencable, RefHandler, ReferencableTreeSingletonContainer, ReferencableTreeListContainer} from "emfular";
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
  _conversationPartners: ReferencableTreeListContainer<ConversationPartner>;
  get conversationPartners(): ConversationPartner[] {
    return this._conversationPartners.get()
  }
  addCP(...cps: ConversationPartner[]) {
    cps.map(cp => {
      this._conversationPartners.add(cp)
    })
  }

  constructor(
    title: string = 'New Conversation',
    author: Author = new Author(),
  ) {
    let ref = RefHandler.createRef(Conversation.ownPath, EClasses.Conversation)
    super(ref);
    this._author = new ReferencableTreeSingletonContainer<Author>(this, Conversation.authorPrefix);
    this._conversationPartners = new ReferencableTreeListContainer<ConversationPartner>(this, Conversation.conversationPartnersPrefix);
    this.$treeChildren.push(this._author, this._conversationPartners);
    this.title = title;
    this.author = author;
  }

  override toJson(): ConversationJson {
    this.prepare(Conversation.ownPath);

    return {
      eClass: this.ref.eClass,
      title: this.title,
      conversationPartners: this._conversationPartners.toJson(),
      author: this._author.toJson(),
    };
  }

  static fromJSON (convJson: ConversationJson): Conversation {
    let context = new Deserializer(convJson);
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
