import { TestBed } from '@angular/core/testing';

import { KEMLArrowStyleConfigurationService } from './kemlarrow-style-configuration.service';

describe('KEMLArrowStyleConfigurationService', () => {
  let service: KEMLArrowStyleConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KEMLArrowStyleConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
