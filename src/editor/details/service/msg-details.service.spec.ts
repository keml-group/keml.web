import { TestBed } from '@angular/core/testing';

import { MsgDetailsService } from './msg-details.service';

describe('MsgDetailsService', () => {
  let service: MsgDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsgDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
