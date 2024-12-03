import {Ref} from "./keml/parser/ref";
import {BoundingBox} from "./graphical/bounding-box";

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
  position?: BoundingBox;
}

export interface Preknowledge extends Information {

}

export interface NewInformation extends Information {
  source: Ref;//ReceiveMessage; //backwards but main
}

export interface InformationLink {
  eClass: string;
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
