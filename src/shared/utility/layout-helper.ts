/* documents all layout specific choices (distances) so that we can work from that on
* treats (0,0) as author position -> knowledge has a negative x, messages a positive x.
*/
import {ConversationPartner} from '../models/keml/conversation-partner';
import {Message, ReceiveMessage, Preknowledge, Information} from "../models/keml/msg-info";
import {BoundingBox} from "../models/graphical/bounding-box";

export class LayoutHelper {
  // distance to first partner should be bigger than distance in between:
  static distanceToFirstCP: number = 300;
  static distanceBetweenCP: number = 150;

  static distanceToFirstMessage: number = 180;
  static distanceBetweenMessages: number = 60;

  static positionForNewPreknowledge: number = 50;

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
      (msg as ReceiveMessage)?.generates?.forEach((r, index ) => {
        if(r.position.w < 7) {
          r.position = this.bbForNewInfo(index)
        }
      })
    }
  }

  static bbForNewInfo(index: number): BoundingBox {
    return new BoundingBox(-600 -10*index, 10*index, 200, 50)
  }

  static bbForInfoDuplication(info: Information): BoundingBox {
    let pos = info.position
    return new BoundingBox(pos.x -10, pos.y+10, pos.w, pos.h)
  }

  static bbForPreknowledge(y: number): BoundingBox {
    return new BoundingBox(-300, y, 200, 50)
  }

  static positionInfos(pre: Preknowledge[], msgs: Message[]): void {
    //todo currently position new infos as 0:
    this.initializeInfoPos(msgs);

    pre.forEach(p => {
      if (p.position.w < 7 ) {
        const timing = Math.min(...p.isUsedOn.map(send => send.timing));
        p.position = this.bbForPreknowledge(LayoutHelper.computeMessageY(timing))
      }
    })
    pre.sort((a, b) => {
      return a.position.y - b.position.y
    })
  }

}
