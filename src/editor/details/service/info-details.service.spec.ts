import { TestBed } from '@angular/core/testing';

import { InfoDetailsService } from './info-details.service';

describe('InfoDetailsService', () => {
  let service: InfoDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
