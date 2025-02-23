import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";

export enum ArrowHead {
  POINTER ='POINTER',
  ATTACK = 'ATTACK',
  SUPPORT = 'SUPPORT',
  SUPPLEMENT = 'SUPPLEMENT',
}

export class ColorFromArrowHead {
  static getColor(arrowHead: ArrowHead): string {
    switch (arrowHead) {
      case ArrowHead.ATTACK: return 'red';
      case ArrowHead.SUPPORT: return 'green';
      case ArrowHead.SUPPLEMENT:
        case ArrowHead.POINTER:
          return 'black';
    }
  }
}

export enum CustomArrowType {
  STANDARD = 'STANDARD',
  DASHED = 'DASHED',
  INTERRUPTION = 'INTERRUPTION',
}

export const ArrowType = {...InformationLinkType, ...CustomArrowType};
export type ArrowType = InformationLinkType | CustomArrowType;
