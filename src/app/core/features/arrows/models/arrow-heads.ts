import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";

export enum ArrowHead {
  POINTER ='POINTER',
  ATTACK = 'ATTACK',
  SUPPORT = 'SUPPORT',
  SUPPLEMENT = 'SUPPLEMENT',
}

export enum CustomArrowType {
  STANDARD = 'STANDARD',
  DASHED = 'DASHED',
  INTERRUPTION = 'INTERRUPTION',
}

export const ArrowType = {...InformationLinkType, ...CustomArrowType};
export type ArrowType = InformationLinkType | CustomArrowType;
