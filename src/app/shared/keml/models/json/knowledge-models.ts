import {Ref} from "emfular";
import {BoundingBox} from "ngx-svg-graphics";

export interface InformationJson {
  eClass: string;
  message: string;
  isInstruction: boolean;
  initialTrust?: number;
  currentTrust?: number;
  feltTrustImmediately: number | undefined;
  feltTrustAfterwards: number | undefined;

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
  SUPPLEMENT = 'SUPPLEMENT', //needs extra tests, jackson serialization treats it as 0 and hence does not write it
  SUPPORT = 'SUPPORT',
  STRONG_SUPPORT = 'STRONG_SUPPORT',
  ATTACK = 'ATTACK',
  STRONG_ATTACK = 'STRONG_ATTACK',
}
