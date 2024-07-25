import { TestBed } from '@angular/core/testing';

import { KemlDrawService } from './keml-draw.service';

describe('KemlDrawService', () => {
  let service: KemlDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KemlDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
