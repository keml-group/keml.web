import {InformationLinkType} from "../knowledge-models";

export enum ArrowHead {
  POINTER,
  ATTACK,
  SUPPORT,
  SUPPLEMENT,
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
