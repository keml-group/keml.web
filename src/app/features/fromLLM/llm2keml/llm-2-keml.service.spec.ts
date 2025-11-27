import { Llm2KemlService } from './llm-2-keml.service';
import {TestBed} from "@angular/core/testing";
import {KemlService} from "@app/shared/keml/edit/keml.service";
import {KemlHistoryService} from "@app/shared/keml/edit/keml-history.service";
import {BehaviorSubject, of} from "rxjs";
import {ConversationJson} from "@app/shared/keml/json/sequence-diagram-models";

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

describe('LlmService integration', () => {
  let llmService: Llm2KemlService;
  let kemlService: KemlService;
  let historyStub: any;

  beforeEach(() => {

    historyStub = {
      // minimal observable so KemlService can subscribe without error
      state$: of(null),
      save: jasmine.createSpy('save')
    };

    TestBed.configureTestingModule({
      providers: [
        Llm2KemlService,
        KemlService,
        { provide: KemlHistoryService, useValue: historyStub }
      ]
    });

    llmService = TestBed.inject(Llm2KemlService);
    kemlService = TestBed.inject(KemlService);
  });

  it('should trigger a single save when processing input', () => {
    llmService.convFromLlmMessages([]);

    expect(historyStub.save).toHaveBeenCalledTimes(1);
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.serializeConversation());
  });
});

