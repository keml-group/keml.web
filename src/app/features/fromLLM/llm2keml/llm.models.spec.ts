import {LLMMessage, LLMMessageAuthorType} from './llm.models';

describe('LLMMessage', () => {
  it('should create an instance', () => {
    expect(new LLMMessage(LLMMessageAuthorType.LLM, 'text')).toBeTruthy();
  });
});
