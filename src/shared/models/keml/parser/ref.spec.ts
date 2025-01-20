import { Ref } from './ref';

describe('Ref', () => {
  it('should create an instance', () => {
    expect(new Ref("//@conversationPartners.0", "http://www.unikoblenz.de/keml#//ConversationPartner")).toBeTruthy();
  });

  it('should deliver the final part (after last .) from the string as number', () => {
    expect(Ref.getIndexFromString('/...../vhgvh.78')).toBe(78);
  })
});
