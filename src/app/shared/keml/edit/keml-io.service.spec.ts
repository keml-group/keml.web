import { TestBed } from '@angular/core/testing';

import { KEMLIOService } from './keml-io.service';

describe('KEMLIOService', () => {
  let service: KEMLIOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KEMLIOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
