import { TestBed } from '@angular/core/testing';

import { ConversationPickService } from './conversation-pick.service';

describe('ConversationPickService', () => {
  let service: ConversationPickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationPickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
