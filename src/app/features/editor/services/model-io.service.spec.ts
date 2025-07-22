import { TestBed } from '@angular/core/testing';

import { ModelIOService } from './model-io.service';
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {
  NewInformation,
  ReceiveMessage,
} from "@app/shared/keml/models/core/msg-info";

describe('ModelIOService', () => {
  let service: ModelIOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelIOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change a new info\'s source', () => {
    let cp = new ConversationPartner()
    let msg1 = new ReceiveMessage(cp, 0, "rec1")
    let msg2 = new ReceiveMessage(cp, 1, "rec2")
    let newInfo = new NewInformation(msg2, 'newInfo', false)
    expect(msg1.generates.length).toEqual(0)
    expect(msg2.generates.length).toEqual(1)
    expect(newInfo.source).toEqual(msg2)

    // call to test:
    service.changeInfoSource(newInfo, msg1)
    expect(msg1.generates.length).toEqual(1)
    expect(msg2.generates.length).toEqual(0)
    expect(newInfo.source).toEqual(msg1)
  })
});
