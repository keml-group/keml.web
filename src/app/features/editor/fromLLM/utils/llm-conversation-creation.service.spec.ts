import { LlmConversationCreationService } from './llm-conversation-creation.service';
import {TestBed} from "@angular/core/testing";

describe('LlmConversationCreationService', () => {
  let service: LlmConversationCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlmConversationCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
