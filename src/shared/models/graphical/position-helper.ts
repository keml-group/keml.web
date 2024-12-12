import {BoundingBox} from "./bounding-box";

export class PositionHelper {

  static absolutePosition(elem: SVGGraphicsElement): BoundingBox {
    let relativePosition: DOMRect = elem.getBBox();
    let translationMatrix: DOMMatrix = elem.getCTM()!;
    let x = relativePosition.x;
    let y = relativePosition.y;
    let x_abs = translationMatrix.a*x+translationMatrix.c*y+translationMatrix.e;
    let y_abs = translationMatrix.b*x+translationMatrix.d*y+translationMatrix.f;
    return new BoundingBox(x_abs,y_abs, relativePosition.width, relativePosition.height)
  }

}
