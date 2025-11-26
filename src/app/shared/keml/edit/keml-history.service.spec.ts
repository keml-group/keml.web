import { TestBed } from '@angular/core/testing';

import { KemlHistoryService } from './keml-history.service';

describe('KemlHistoryService', () => {
  let service: KemlHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KemlHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
