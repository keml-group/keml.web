import { ChatGpt2LlmService } from './chat-gpt-2-llm.service';
import {TestBed} from "@angular/core/testing";

describe('ChatGpt2LlmService', () => {
    let service: ChatGpt2LlmService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(ChatGpt2LlmService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });
