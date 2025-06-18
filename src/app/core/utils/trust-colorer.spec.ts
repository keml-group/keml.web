import { TrustColorer } from './trust-colorer';

describe('TrustColorer', () => {
  it('should create an instance', () => {
    expect(new TrustColorer()).toBeTruthy();
  });

  //todo why is 0.53335 here 88 but 77 in the string?
  it('should compute twoHexDigits', () => {
    let tests = new Map<number, string>()
    tests.set(0, '00')
    tests.set(0.5, '80')
    tests.set(0.53335, '88')
    tests.set(1, 'ff')
    tests.forEach((str, num) =>  {
      expect(TrustColorer.computeTwoHexDigits(num)).toBe(str);
    })
  })

  it('should produce red', () => {
    expect(TrustColorer.hexColor(-1.0)).toEqual('#ff0000')
  })

  it('should produce light red', () => {
    expect( TrustColorer.hexColor(-0.5)).toEqual('#ff8000')
  })

  it('should produce another light red', () => {
    expect( TrustColorer.hexColor(-0.53335)).toEqual('#ff7700')
  })

  it('should produce yellow', () => {
    expect( TrustColorer.hexColor(0)).toEqual('#ffff00')
  })

  it('should produce light green', () => {
    expect( TrustColorer.hexColor(0.53335)).toEqual('#77ff00')
  })

  it('should produce green', () => {
    expect( TrustColorer.hexColor(1)).toEqual('#00ff00')
  })

});
