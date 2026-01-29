import { LayoutingService } from './layouting.service';
import {Preknowledge, SendMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {BoundingBox} from "ngx-svg-graphics";
import {TestBed} from "@angular/core/testing";

describe('LayoutingService', () => {
  let service: LayoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should positionPreknowledge correctly', () => {
      let s1 = new SendMessage(1, 's1')
    let s1BB = LayoutingService.bbForPreknowledge(LayoutingService.computeMessageY(1))
    let s2 = new SendMessage(2, 's2')
    let s2BB = LayoutingService.bbForPreknowledge(LayoutingService.computeMessageY(2))
    let s7 = new SendMessage(7, 's7')
    let s7BB = LayoutingService.bbForPreknowledge(LayoutingService.computeMessageY(7))
    let defaultBB = LayoutingService.bbForPreknowledge(LayoutingService.computeMessageY(0))

    let p0 = new Preknowledge('p0')
    p0.addIsUsedOn(s7, s2)
    let p0BB: BoundingBox = {x: -20, y: -50, h: 50, w:200}
    let p0wbb = new Preknowledge('p0', false, p0BB)
    p0wbb.addIsUsedOn(s7, s2)
    let p1 = new Preknowledge('p1')
    let p2 = new Preknowledge('p2', true)
    p2.addIsUsedOn(s7)
    let p3 = new Preknowledge('p3', false)
    p3.addIsUsedOn(s1)
    let p3BB: BoundingBox = {x: -200, y: 500, h: 50, w:200}
    let p3wbb = new Preknowledge('p3', false, p3BB)
    p3wbb.addIsUsedOn(s1)
    let p4 = new Preknowledge('p4')
    p4.addIsUsedOn(s1, s7, s2)

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
    LayoutingService.positionPreknowledge(t0)
    expect(t0).toEqual([])

    let t1 = [p0, p0wbb, p1, p2, p3, p3wbb, p4]
    LayoutingService.positionPreknowledge(t1)
    expect(t1).toEqual(allOrdered)
    verifyAll()

    let t2 = [p4, p3wbb, p3, p2, p1, p0wbb, p0]
    LayoutingService.positionPreknowledge(t2)
    expect(t2).toEqual(allOrdered43)
    verifyAll()

    let t3 = [p3wbb, p1, p4]
    LayoutingService.positionPreknowledge(t3)
    expect(t3).toEqual([p1, p4, p3wbb])
  })
});
