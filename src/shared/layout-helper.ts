/* documents all layout specific choices (distances) so that we can work from taht on
* treats (0,0) as author position -> knowledge has a negative x, messages a positive x.
*/
import {ConversationPartner, Message, ReceiveMessage} from "./models/sequence-diagram-models";
import {Preknowledge} from "./models/knowledge-models";

export class LayoutHelper {
  // distance to first partner should be bigger than distance in between:
  static distanceToFirstCP: number = 300;
  static distanceBetweenCP: number = 150;

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

  static nextConversationPartnerPosition(positionBefore: number): number {
    return positionBefore + LayoutHelper.distanceBetweenCP;
  }

  // unused since currently message timing is a simple index used on the fly
  static positionMessages(messages: Message[]) {
    const distanceToFirst: number = 180;
    const distanceBetween: number = 60;

    for (let i = 0; i < messages.length; i++) {
      messages[i].timing = distanceToFirst + i*distanceBetween;
    }
  }

  static  computeMessageY(timing: number): number {
    return 180+60*timing;
  }

  static initializeInfoPos(messages: Message[]) {
    for (let msg of messages) {
      //const infos = (msg as ReceiveMessage).generates;
      (msg as ReceiveMessage)?.generates?.forEach(r => {
        r.x = 0;
        r.y = 0;
      })
    }
  }

  static positionInfos(pre: Preknowledge[], msgs: Message[]): void {
    //todo currently position new infos as 0:
    this.initializeInfoPos(msgs);

    pre.forEach(p => {
      const timing = Math.min(...p.isUsedOn.map(send => send.timing));
      p.y=LayoutHelper.computeMessageY(timing);
    })
    pre.sort((a, b) => {
      return a.y - b.y
    })
    // use map to organize preknowledge? Or just pointer? Maybe easier
  }



}
