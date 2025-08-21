import { TestBed } from '@angular/core/testing';

import { InfoTrustDetailsService } from './info-trust-details.service';

describe('InfoTrustDetailsService', () => {
  let service: InfoTrustDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoTrustDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
