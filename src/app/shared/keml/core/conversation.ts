import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {Deserializer, Ref, Referencable, RefHandler, ReTreeSingleContainer, ReTreeListContainer, attribute} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {createKemlRegistry} from "@app/shared/keml/kemlregistry";


export class Conversation extends Referencable {
  static readonly $authorName = 'author';
  static readonly $conversationPartnersName = 'conversationPartners';

  @attribute()
  title: string;

  _author: ReTreeSingleContainer<Author>;
  get author(): Author {
    return this._author.get()!!
  }
  set author(author: Author) {
    this._author.add(author);
  }
  _conversationPartners: ReTreeListContainer<ConversationPartner>;
  get conversationPartners(): ConversationPartner[] {
    return this._conversationPartners.get()
  }
  addCP(...cps: ConversationPartner[]) {
    cps.map(cp => {
      this._conversationPartners.add(cp)
    })
  }

  constructor(
    _?: Ref,
    title: string = 'New Conversation'
  ) {
    let refC = RefHandler.createRef(RefHandler.rootPath, EClasses.Conversation)
    super(refC);
    this._author = new ReTreeSingleContainer<Author>(this, Conversation.$authorName, undefined, EClasses.Author);
    this._conversationPartners = new ReTreeListContainer<ConversationPartner>(this, Conversation.$conversationPartnersName, undefined, EClasses.ConversationPartner);
    this.title = title;
    this.author = new Author();
  }

  static create(title: string = 'New conversation', author?: Author): Conversation {
    const conv = new Conversation(undefined, 'New Conversation');
    conv.title = title;
    conv.author = author? author: new Author();
    return conv;
  }

  override toJson(): ConversationJson {
    this.prepare(RefHandler.rootPath);

    return (super.toJson() as ConversationJson);
  }

  static fromJSON (convJson: ConversationJson): Conversation {
    return Deserializer.fromJSON<Conversation>(
      convJson,
      createKemlRegistry(),
      EClasses.Conversation
    )
  }

}
