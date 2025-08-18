import { IncrementalSimulationService } from './incremental-simulation.service';
import {Conversation} from "@app/shared/keml/models/core/conversation";

describe('IncrementalSimulationService', () => {
  it('should create an instance', () => {
    expect(new IncrementalSimulationService()).toBeTruthy();
  });
});
