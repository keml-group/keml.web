import {Ref} from "../parser/ref";
import {BoundingBox} from "../../graphical/bounding-box";

export interface InformationJson {
  eClass: string;
  message: string;
  isInstruction: boolean;
  initialTrust: number;
  currentTrust: number;
  feltTrustImmediately: number;
  feltTrustAfterwards: number;

  causes: InformationLinkJson[];
  targetedBy: Ref[];

  isUsedOn: Ref[];
  repeatedBy: Ref[];
  position?: BoundingBox;
}

export interface PreknowledgeJson extends InformationJson {

}

export interface NewInformationJson extends InformationJson {
  source: Ref;//ReceiveMessage; //backwards but main
}

export interface InformationLinkJson {
  eClass: string;
  linkText?: string;
  type: InformationLinkType;
  source: Ref; //backwards but main
  target: Ref;
}

export enum InformationLinkType {
  STRONG_ATTACK = 'STRONG_ATTACK',
  ATTACK = 'ATTACK',
  SUPPLEMENT = 'SUPPLEMENT',
  SUPPORT = 'SUPPORT',
  STRONG_SUPPORT = 'STRONG_SUPPORT',
}
