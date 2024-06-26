import {ReceiveMessage, SendMessage} from "./sequence-diagram-models";

export interface Information {
  eClass: string;
  message: string;
  isInstruction: boolean;
  initialTrust: number;
  currentTrust: number;

  causes: InformationLink[]; //todo avoid?
  targetedBy: InformationLink[]; //todo avoid?

  isUsedOn: SendMessage[];
  repeatedBy: ReceiveMessage[];
}

export interface Preknowledge extends Information {

}

export interface NewInformation extends Information {
  source: ReceiveMessage;
}

export interface InformationLink {
  linkText?: string;
  type: InformationLinkType;
  source: Information;
  target: Information;
}

export enum InformationLinkType {
  STRONG_ATTACK,
  ATTACK,
  SUPPLEMENT,
  SUPPORT,
  STRONG_SUPPORT
}
