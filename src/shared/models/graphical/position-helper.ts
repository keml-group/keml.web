import {BoundingBox} from "./bounding-box";
import {Point} from "@angular/cdk/drag-drop";

export class PositionHelper {

  static absolutePosition(elem: SVGGraphicsElement): BoundingBox {
    let relativePosition: DOMRect = elem.getBBox();
    let translationMatrix: DOMMatrix = elem.getCTM()!;
    let x = relativePosition.x;
    let y = relativePosition.y;
    let x_abs = translationMatrix.a*x+translationMatrix.c*y+translationMatrix.e;
    let y_abs = translationMatrix.b*x+translationMatrix.d*y+translationMatrix.f;
    return {x: x_abs, y: y_abs, w: relativePosition.width, h: relativePosition.height}
  }

  static makeRelativeToElem(p: Point, elem: SVGGraphicsElement): void {
    this.matrixTransform(p, elem.getCTM()!.inverse())
  }

  static matrixTransform(p: Point, translationMatrix: DOMMatrix): void {
    let x = p.x;
    let y = p.y;
    let x_trans = translationMatrix.a*x+translationMatrix.c*y+translationMatrix.e;
    let y_trans = translationMatrix.b*x+translationMatrix.d*y+translationMatrix.f;
    p.x = x_trans
    p.y = y_trans
  }

  static newBoundingBox(x: number = 0, y: number = 0, width: number = 5, height: number = 5): BoundingBox {
    return {x: x, y: y, w: width, h: height};
  }
}
