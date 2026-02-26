import {JsonOf} from "emfular";
import {InformationLink, NewInformation, PreKnowledge} from "@app/shared/keml/core/msg-info";

export type NewInformationJson = JsonOf<NewInformation>
export type PreknowledgeJson = JsonOf<PreKnowledge>
export type InformationLinkJson = JsonOf<InformationLink>


export enum InformationLinkType {
  SUPPLEMENT = 'SUPPLEMENT', //needs extra tests, jackson serialization treats it as 0 and hence does not write it
  SUPPORT = 'SUPPORT',
  STRONG_SUPPORT = 'STRONG_SUPPORT',
  ATTACK = 'ATTACK',
  STRONG_ATTACK = 'STRONG_ATTACK',
}
