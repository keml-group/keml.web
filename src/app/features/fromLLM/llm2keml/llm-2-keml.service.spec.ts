import { Llm2KemlService } from './llm-2-keml.service';
import {TestBed} from "@angular/core/testing";

describe('LlmConversationCreationService', () => {
  let service: Llm2KemlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Llm2KemlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
