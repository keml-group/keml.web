import { Injectable } from '@angular/core';
import {BoundingBox} from "../models/graphical/bounding-box";
import {PositionHelper} from "../models/graphical/position-helper";

@Injectable({
  providedIn: 'root'
})
export class SVGAccessService {

  constructor() { }

  getElemById(id: string): SVGGraphicsElement | undefined {
    let elem = document.getElementById(id)
    return elem as unknown as SVGGraphicsElement
  }

  getRelativePosition(id: string, node: SVGGraphicsElement): BoundingBox | undefined {
    let elem = this.getElemById(id)
    if (elem) {
      let abs = PositionHelper.absolutePosition(elem)
      PositionHelper.makeRelativeToElem(abs, node)
      return abs;
    }
    return undefined
  }
}
