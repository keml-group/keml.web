import {JsonOf} from "emfular";
import {Author} from "@app/shared/keml/core/author";
import {Conversation} from "@app/shared/keml/core/conversation";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {ReceiveMessage, SendMessage} from "@app/shared/keml/core/msg-info";

export type ConversationJson = JsonOf<Conversation>
export type AuthorJson = JsonOf<Author>
export type ConversationPartnerJson = JsonOf<ConversationPartner>
export type SendMessageJson = JsonOf<SendMessage>
export type ReceiveMessageJson= JsonOf<ReceiveMessage>



