import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";

export enum ArrowHead {
  POINTER ='POINTER',
  ATTACK = 'ATTACK',
  SUPPORT = 'SUPPORT',
  SUPPLEMENT = 'SUPPLEMENT',
}

export enum CustomArrowLineType {
  STANDARD = 'STANDARD',
  DASHED = 'DASHED'
}

export const ArrowType = {...InformationLinkType, ...CustomArrowLineType};
export type ArrowType = InformationLinkType | CustomArrowLineType;
