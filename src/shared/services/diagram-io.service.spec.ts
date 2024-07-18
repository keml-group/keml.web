import { TestBed } from '@angular/core/testing';

import { DiagramIoService } from './diagram-io.service';

describe('DiagramIoService', () => {
  let service: DiagramIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagramIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
