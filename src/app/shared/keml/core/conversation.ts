import {Author} from "./author";
import {ConversationPartner} from "./conversation-partner";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";
import {Deserializer, Referencable, attribute, eClass, reference, ModelList} from "emfular";
import {EClasses} from "@app/shared/keml/eclasses";
import {ConversationRefs, KemlMeta} from "@app/shared/keml/keml-meta";

@eClass(KemlMeta)
export class Conversation extends Referencable<any> {

  @attribute()
  title: string;

  @reference(ConversationRefs.author)
  declare author: Author

  @reference(ConversationRefs.conversationPartners)
  declare conversationPartners:  ModelList<ConversationPartner>

  constructor(
    title: string = 'New Conversation'
  ) {
    super();
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
