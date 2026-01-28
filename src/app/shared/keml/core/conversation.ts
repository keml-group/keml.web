import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {Deserializer, Ref, Referencable, RefHandler, ReTreeSingleContainer, ReTreeListContainer} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {createKemlRegistry} from "@app/shared/keml/kemlregistry";
import {JsonOf} from "../../../../../../../../EMFular/projects/emfular/src/lib/serialization/json-deserializable";


export class Conversation extends Referencable {
  static readonly $authorName = 'author';
  static readonly $conversationPartnersName = 'conversationPartners';
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
    title: string = 'New Conversation',
    author: Author = new Author(),
  ) {
    let ref = RefHandler.createRef(RefHandler.rootPath, EClasses.Conversation)
    super(ref);
    this._author = new ReTreeSingleContainer<Author>(this, Conversation.$authorName, undefined, EClasses.Author);
    this._conversationPartners = new ReTreeListContainer<ConversationPartner>(this, Conversation.$conversationPartnersName, undefined, EClasses.ConversationPartner);
    this.title = title;
    this.author = author;
  }

  override toJson(): ConversationJson {
    this.prepare(RefHandler.rootPath);

    return {
      eClass: this.ref.eClass,
      title: this.title,
      conversationPartners: this._conversationPartners.toJson(),
      author: this._author.toJson(),
    };
  }

  static fromJson(json: ConversationJson, _: Ref): Conversation {
    return new Conversation(json.title)
  }

  //todo naming
  static fromJSON (convJson: ConversationJson): Conversation {
    let context = new Deserializer(convJson, createKemlRegistry());
    let ref: Ref = {
      $ref: RefHandler.rootPath,
      eClass: EClasses.Conversation
    }
    let conv = context.createWithChildren<Conversation>(ref, convJson as JsonOf<Conversation>);
    context.addAllReferences()
    return conv;
  }

}
