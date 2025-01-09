import { Injectable } from '@angular/core';
import {BoundingBox} from "../models/graphical/bounding-box";
import {PositionHelper} from "../models/graphical/position-helper";
import {BehaviorSubject, Observable} from "rxjs";
import {Information, Message, ReceiveMessage, SendMessage} from "../models/keml/msg-info";

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

  notifyPositionChangeMessage(msg: Message): void {
    this.notifyPositionChange(msg.gId)
    let rec = (msg as ReceiveMessage)
    rec.generates?.forEach( i => {
      this.notifyPositionChange(i.gId)
    })
    rec.repeats?.forEach( i => {
      this.notifyPositionChange(i.gId)
    })
    let send = (msg as SendMessage)
    send.uses?.forEach( i => {
      this.notifyPositionChange(i.gId)
    })
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
