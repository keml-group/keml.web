import { Injectable } from '@angular/core';
import {ArrowHead, ArrowType} from "@app/shared/keml/graphical/helper/arrow-styling/arrow-heads";
import {ArrowStyleConfiguration, ArrowStyleConfigurationService} from "ngx-svg-graphics";

@Injectable({
  providedIn: 'root'
})
export class KEMLArrowStyleConfigurationService extends ArrowStyleConfigurationService {

  override styleArrow(arrowType?: string): ArrowStyleConfiguration {
    if (arrowType) {
      let typed: ArrowType = (arrowType as ArrowType);
      return KEMLArrowStyleConfigurationService.styleArrowTyped(typed)
    } else return KEMLArrowStyleConfigurationService.styleArrowTyped()
  }


  private static styleArrowTyped(arrowType?: ArrowType): ArrowStyleConfiguration {
    let arrowHead: ArrowHead = this.setArrowHead(arrowType)
    return {
      endPointer: arrowHead, //todo this field should later be KEML independent
      color: this.setColor(arrowHead),
      dashed: this.setDashed(arrowType),
    }
  }

  private static setArrowHead(arrowType?: ArrowType): ArrowHead {
    switch (arrowType) {
      case ArrowType.ATTACK:
      case ArrowType.STRONG_ATTACK: {
        return ArrowHead.ATTACK;
      }
      case ArrowType.SUPPORT:
      case ArrowType.STRONG_SUPPORT: {
        return ArrowHead.SUPPORT;
      }
      case ArrowType.SUPPLEMENT: {
        return ArrowHead.SUPPLEMENT;
      }
      default: {
        return ArrowHead.POINTER;
      }
    }
  }

  private static setColor(arrowHead: ArrowHead): string {
    switch (arrowHead) {
      case ArrowHead.ATTACK: return 'red';
      case ArrowHead.SUPPORT: return 'green';
      case ArrowHead.SUPPLEMENT:
      case ArrowHead.POINTER:
        return 'black';
    }
  }

  private static setDashed(arrowType?: ArrowType): number[] {
    switch(arrowType) {
      case ArrowType.DASHED:
      case ArrowType.SUPPORT:
      case ArrowType.ATTACK: {
        return [5];
      }
      default: {
        return [0];
      }
    }
  }
}
