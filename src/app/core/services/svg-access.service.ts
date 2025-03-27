import { Injectable } from '@angular/core';
import {BoundingBox} from "../features/arrows/models/bounding-box";
import {PositionHelper} from "../features/arrows/utils/position-helper";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SVGAccessService {

  positionChange: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  notifyPositionChange(id: string) {
    this.positionChange.next(id);
    console.log(id)
  }

  listenToPositionChange(): Observable<string> {
    return this.positionChange.asObservable()
  }

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
