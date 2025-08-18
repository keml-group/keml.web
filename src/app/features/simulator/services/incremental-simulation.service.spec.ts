import { IncrementalSimulationService } from './incremental-simulation.service';
import {TestBed} from "@angular/core/testing";

describe('IncrementalSimulationService', () => {
  let service: IncrementalSimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: IncrementalSimulationService, useValue: {}}]
    });
    service = TestBed.inject(IncrementalSimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
