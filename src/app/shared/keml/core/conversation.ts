import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {Deserializer, Referencable, ReTreeSingleContainer, ReTreeListContainer, attribute, eClass} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";

@eClass(EClasses.Conversation)
export class Conversation extends Referencable {
  static readonly $authorName = 'author';
  static readonly $conversationPartnersName = 'conversationPartners';

  @attribute()
  title: string;

  _author: ReTreeSingleContainer<Author, typeof Conversation.$authorName>;
  get author(): Author {
    return this._author.get()!!
  }
  set author(author: Author) {
    this._author.add(author);
  }
  _conversationPartners: ReTreeListContainer<ConversationPartner, typeof Conversation.$conversationPartnersName>;
  get conversationPartners(): ConversationPartner[] {
    return this._conversationPartners.get()
  }
  addCP(...cps: ConversationPartner[]) {
    cps.map(cp => {
      this._conversationPartners.add(cp)
    })
  }

  constructor(
    title: string = 'New Conversation'
  ) {
    super();
    this._author = new ReTreeSingleContainer(this, Conversation.$authorName, undefined, EClasses.Author);
    this._conversationPartners = new ReTreeListContainer(this, Conversation.$conversationPartnersName, undefined, EClasses.ConversationPartner);
    this.title = title;
    this.author = new Author();
  }

  static create(title: string = 'New conversation', author?: Author): Conversation {
    const conv = new Conversation('New Conversation');
    conv.title = title;
    conv.author = author? author: new Author();
    return conv;
  }

  static fromJSON (convJson: ConversationJson): Conversation {
    return Deserializer.fromJSON<Conversation>(
      convJson,
      EClasses.Conversation
    )
  }

}
