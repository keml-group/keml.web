import { Injectable } from '@angular/core';
import {SVGAccessService} from "@app/core/features/arrows/services/svg-access.service";
import {Message, ReceiveMessage, SendMessage} from "@app/shared/keml/models/core/msg-info";

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
