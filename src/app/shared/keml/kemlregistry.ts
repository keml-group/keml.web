import {ModelRegistry} from "emfular"
import {EClasses} from "@app/shared/keml/eclasses";
import {
  InformationLink,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "@app/shared/keml/core/msg-info";
import {Conversation} from "@app/shared/keml/core/conversation";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {Author} from "@app/shared/keml/core/author";

export function initializeKEMLRegistry(registry: ModelRegistry) {
    registry.set(EClasses.Conversation, Conversation)
    registry.set(EClasses.Author, Author)
    registry.set(EClasses.ConversationPartner, ConversationPartner)
    registry.set(EClasses.SendMessage, SendMessage)
    registry.set(EClasses.ReceiveMessage, ReceiveMessage)
    registry.set(EClasses.Preknowledge, Preknowledge)
    registry.set(EClasses.NewInformation, NewInformation)
    registry.set(EClasses.InformationLink, InformationLink)
}

export function createKemlRegistry(): ModelRegistry {
  let reg = new ModelRegistry();
  initializeKEMLRegistry(reg);
  return reg;
}
