import { TestBed } from '@angular/core/testing';

import { SimulationDialogueService } from './simulation-dialogue.service';

describe('SimulationDialogueService', () => {
  let service: SimulationDialogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationDialogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
