import {
  InformationLink,
  NewInformation,
  Preknowledge,
  ReceiveMessage,
} from "@app/shared/keml/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";

export function newRec(): ReceiveMessage {
    return new ReceiveMessage(4)
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
