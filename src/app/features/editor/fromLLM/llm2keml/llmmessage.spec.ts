import {LLMMessage, LLMMessageAuthorType} from './llmmessage';

describe('LLMMessage', () => {
  it('should create an instance', () => {
    expect(new LLMMessage(LLMMessageAuthorType.LLM, 'text')).toBeTruthy();
  });
});
