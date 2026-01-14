import {
  InformationLink,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
  SendMessage
} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";

export function newRec(): ReceiveMessage {
  const cp = new ConversationPartner()
  return new ReceiveMessage(cp, 4)
}

export function newSend(): SendMessage {
  const cp = new ConversationPartner()
  return new SendMessage(cp, 3)
}

export function newNewInfo(): NewInformation {
  const rec = newRec()
  return new NewInformation(rec, 'newInfo')
}

export function newInfoLink(): InformationLink {
  const newInfo= newNewInfo();
  const pre = new Preknowledge()
  return new InformationLink(newInfo, pre, InformationLinkType.STRONG_ATTACK)
}
