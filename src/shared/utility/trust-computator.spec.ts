import { TrustComputator } from './trust-computator';
import {Conversation} from "../models/keml/conversation";
import {Preknowledge, ReceiveMessage} from "../models/keml/msg-info";
import {ConversationPartner} from "../models/keml/conversation-partner";
import {Author} from "../models/keml/author";

describe('TrustComputator', () => {
  it('should create an instance', () => {
    expect(new TrustComputator()).toBeTruthy();
  });

  it('should adapt the current trusts', () => {
    let pre0 = new Preknowledge('pre0',
      false, undefined, undefined, undefined, undefined, undefined,
      0.5, 0 )
    let pre1 = new Preknowledge('pre1',
      false, undefined, undefined, undefined, undefined, undefined,
      0.5, 0 )
    let pre2 = new Preknowledge('pre2',
      false, undefined, undefined, undefined, undefined, undefined,
      0.5, 0 )
    let pres = [pre0, pre1, pre2]

    let cp0 = new ConversationPartner('cp0')
    let cp1 = new ConversationPartner('cp1')
    let cps = [cp0, cp1]

    let rec0 = new ReceiveMessage(cp0, 0, 'm0')
    let rec1 = new ReceiveMessage(cp1, 1, 'm1')
    let rec2 = new ReceiveMessage(cp0, 2, 'm2')
    let msgs = [rec0, rec1, rec2]

    //todo add infos and Links

    let author = new Author('author', 0, pres, msgs)

    let conv = new Conversation('trusts', author, cps)

    //call to test:
    TrustComputator.computeCurrentTrusts(conv)

    expect() //todo
  })
});
