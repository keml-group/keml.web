import {
  NewInformation,
  ReceiveMessage,
} from "@app/shared/keml/core/msg-info";

export function newNewInfo(): NewInformation {
  const rec = new ReceiveMessage(undefined, 4)
  return new NewInformation(rec, 'newInfo')
}
