import {ReceiveMessage, SendMessage} from "./sequence-diagram-models";

//try out: new helper for message positioning
export interface Position {
  x: number;
  y: number;
  width: number;
  heigt: number;
}

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
  xPosition: number;
  yPosition: number;
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
