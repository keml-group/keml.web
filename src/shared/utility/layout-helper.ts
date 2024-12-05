/* documents all layout specific choices (distances) so that we can work from taht on
* treats (0,0) as author position -> knowledge has a negative x, messages a positive x.
*/
import {ConversationPartner} from '../models/keml/conversation-partner';
import {Message, ReceiveMessage, Preknowledge} from "../models/keml/msg-info";

export class LayoutHelper {
  // distance to first partner should be bigger than distance in between:
  static distanceToFirstCP: number = 300;
  static distanceBetweenCP: number = 150;

  static distanceToFirstMessage: number = 180;
  static distanceBetweenMessages: number = 60;

  /*
 positions the xPositions of the convPartners list.
 It currently assumes no meaningful xPosition but just fills this field
 It could later evaluate the current values and adjust them if things are not ok
 */
  static positionConversationPartners(convPartners: ConversationPartner[]) {
    for (let i = 0; i < convPartners.length; i++) {
      convPartners[i].xPosition = LayoutHelper.distanceToFirstCP + i * LayoutHelper.distanceBetweenCP;
    }
  }

  static nextConversationPartnerPosition(positionBefore?: number): number {
    if(positionBefore) {
      return positionBefore + LayoutHelper.distanceBetweenCP;
    } else {return LayoutHelper.distanceToFirstCP;}
  }

  static  computeMessageY(timing: number): number {
    return LayoutHelper.distanceToFirstMessage+LayoutHelper.distanceBetweenMessages*timing;
  }

  static initializeInfoPos(messages: Message[]) {
    for (let msg of messages) {
      //const infos = (msg as ReceiveMessage).generates;
      (msg as ReceiveMessage)?.generates?.forEach(r => {
        if(r.position.w < 7) {
          r.position.x = -600;
          r.position.y = 0;
          r.position.w = 200;
          r.position.h = 50;
        }
      })
    }
  }

  static positionInfos(pre: Preknowledge[], msgs: Message[]): void {
    //todo currently position new infos as 0:
    this.initializeInfoPos(msgs);

    pre.forEach(p => {
      if (p.position.w < 7 ) {
        const timing = Math.min(...p.isUsedOn.map(send => send.timing));
        p.position.x=-300;
        p.position.y=LayoutHelper.computeMessageY(timing);
        p.position.w = 200;
        p.position.h = 50;
      }
    })
    pre.sort((a, b) => {
      return a.position.y - b.position.y
    })
  }

}
