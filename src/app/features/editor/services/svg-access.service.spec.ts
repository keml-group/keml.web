import { TestBed } from '@angular/core/testing';

import { SVGAccessService } from './svg-access.service';

describe('SVGAccessServiceService', () => {
  let service: SVGAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SVGAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
