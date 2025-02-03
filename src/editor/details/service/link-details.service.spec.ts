import { TestBed } from '@angular/core/testing';

import { LinkDetailsService } from './link-details.service';

describe('LinkDetailsService', () => {
  let service: LinkDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
