import { TestBed } from '@angular/core/testing';

import { MsgPositionChangeService } from './msg-position-change.service';

describe('MsgPositionChangeService', () => {
  let service: MsgPositionChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsgPositionChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
