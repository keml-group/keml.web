import { Injectable } from '@angular/core';
import {Message, ReceiveMessage, SendMessage} from "@app/shared/keml/models/core/msg-info";
import {SVGAccessService} from "ngx-arrows";

@Injectable({
  providedIn: 'root'
})
export class MsgPositionChangeService {

  constructor(
    private svgAccessService: SVGAccessService
  ) { }

  notifyPositionChangeMessage(msg: Message): void {
    this.svgAccessService.notifyPositionChange(msg.gId)
    let rec = (msg as ReceiveMessage)
    rec.generates?.forEach( i => {
      this.svgAccessService.notifyPositionChange(i.gId)
    })
    rec.repeats?.forEach( i => {
      this.svgAccessService.notifyPositionChange(i.gId)
    })
    let send = (msg as SendMessage)
    send.uses?.forEach( i => {
      this.svgAccessService.notifyPositionChange(i.gId)
    })
  }

}
