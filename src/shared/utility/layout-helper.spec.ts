import { LayoutHelper } from './layout-helper';
import {Preknowledge, SendMessage} from "../models/keml/msg-info";
import {ConversationPartner} from "../models/keml/conversation-partner";
import {BoundingBox} from "../models/graphical/bounding-box";

describe('LayoutHelper', () => {
  it('should create an instance', () => {
    expect(new LayoutHelper()).toBeTruthy();
  });

  it('should positionPreknowledge correctly', () => {
    let cp = new ConversationPartner('cp0')
    let s1 = new SendMessage(cp, 1, 's1')
    let s1BB = LayoutHelper.bbForPreknowledge(LayoutHelper.computeMessageY(1))
    let s2 = new SendMessage(cp, 2, 's2')
    let s2BB = LayoutHelper.bbForPreknowledge(LayoutHelper.computeMessageY(2))
    let s7 = new SendMessage(cp, 7, 's7')
    let s7BB = LayoutHelper.bbForPreknowledge(LayoutHelper.computeMessageY(7))
    let defaultBB = LayoutHelper.bbForPreknowledge(LayoutHelper.computeMessageY(0))

    let p0 = new Preknowledge('p0', false, undefined, [], [], [s7, s2])
    let p0BB: BoundingBox = {x: -20, y: -50, h: 50, w:200}
    let p0wbb = new Preknowledge('p0', false, p0BB, [], [], [s7, s2] )
    let p1 = new Preknowledge('p1')
    let p2 = new Preknowledge('p2', true, undefined, [], [], [s7])
    let p3 = new Preknowledge('p3', false, undefined, [], [], [s1])
    let p3BB: BoundingBox = {x: -200, y: 500, h: 50, w:200}
    let p3wbb = new Preknowledge('p3', false, p3BB, [], [], [s1] )
    let p4 = new Preknowledge('p4', false, undefined, [], [], [s1, s7, s2] )

    let allOrdered: Preknowledge[] = [
      p0wbb, //-50
      p1, //0
      p3, p4, //1
      p0, //2
      p3wbb, //500
      p2, //7
    ]
    let allOrdered43: Preknowledge[] = [
      p0wbb, //-50
      p1, //0
      p4, p3, //1 -> only change
      p0, //2
      p3wbb, //500
      p2, //7
    ]

    //verify all positions:
    function verifyAll() {
      expect(p0.position).toEqual(s2BB)
      expect(p0wbb.position).toEqual(p0BB)
      expect(p1.position).toEqual(defaultBB)
      expect(p2.position).toEqual(s7BB)
      expect(p3.position).toEqual(s1BB)
      expect(p3wbb.position).toEqual(p3BB)
      expect(p4.position).toEqual(s1BB)
    }

    let t0: Preknowledge[] = []
    LayoutHelper.positionPreknowledge(t0)
    expect(t0).toEqual([])

    let t1 = [p0, p0wbb, p1, p2, p3, p3wbb, p4]
    LayoutHelper.positionPreknowledge(t1)
    expect(t1).toEqual(allOrdered)
    verifyAll()

    let t2 = [p4, p3wbb, p3, p2, p1, p0wbb, p0]
    LayoutHelper.positionPreknowledge(t2)
    expect(t2).toEqual(allOrdered43)
    verifyAll()

    let t3 = [p3wbb, p1, p4]
    LayoutHelper.positionPreknowledge(t3)
    expect(t3).toEqual([p1, p4, p3wbb])

  })
});
