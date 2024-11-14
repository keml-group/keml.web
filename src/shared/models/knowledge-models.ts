import {Ref} from "./keml/parser/ref";

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

  causes: InformationLink[];
  targetedBy: Ref[];

  isUsedOn: Ref[];
  repeatedBy: Ref[];
  x: number;
  y: number;
}

export interface Preknowledge extends Information {

}

export interface NewInformation extends Information {
  source: Ref;//ReceiveMessage; //backwards but main
}

export interface InformationLink {
  linkText?: string;
  type: InformationLinkType;
  source: Ref; //backwards but main
  target: Ref;
}

export enum InformationLinkType {
  STRONG_ATTACK,
  ATTACK,
  SUPPLEMENT,
  SUPPORT,
  STRONG_SUPPORT
}
