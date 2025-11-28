import {Llm2KemlService} from './llm-2-keml.service';
import {TestBed} from "@angular/core/testing";
import {KemlService} from "@app/shared/keml/edit/keml.service";
import {KemlHistoryService} from "@app/shared/keml/edit/keml-history.service";
import {of} from "rxjs";
import {LLMMessageAuthorType} from "@app/features/fromLLM/llm2keml/llm.models";

describe('Llm2KemlService', () => {
  let service: Llm2KemlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Llm2KemlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('Llm2KemlService integration with history', () => {
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

  it('should trigger a single save when processing (empty) input', () => {
    llmService.convFromLlmMessages([]);

    expect(historyStub.save).toHaveBeenCalledTimes(1);
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.serializeConversation());
  });

  it('should trigger a single save when processing real input', () => {
    llmService.convFromLlmMessages([
      {
        author: LLMMessageAuthorType.Author,
        message: 'm1'
      },
      {
        author: LLMMessageAuthorType.LLM,
        message: 'm2'
      },
      {
        author: LLMMessageAuthorType.Author,
        message: 'm3'
      }
    ]);

    expect(historyStub.save).toHaveBeenCalledTimes(1);
    expect(historyStub.save).toHaveBeenCalledWith(kemlService.serializeConversation());

    //verify that the right object was created:
    expect(kemlService.conversation.conversationPartners[0].name).toBe('LLM')

    expect(kemlService.conversation.author.messages.length).toBe(3);
    expect(kemlService.conversation.author.messages[0].content).toBe("m1");
    expect(kemlService.conversation.author.messages[1].content).toBe("m2");
    expect(kemlService.conversation.author.messages[2].content).toBe("m3");

    expect(kemlService.conversation.author.messages[0].isSend()).toBeTrue();
    expect(kemlService.conversation.author.messages[1].isSend()).toBeFalse();
    expect(kemlService.conversation.author.messages[2].isSend()).toBeTrue();

  });
});

