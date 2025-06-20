import { NumberDisplayer } from './number-displayer';

describe('NumberDisplayer', () => {
  it('should create an instance', () => {
    expect(new NumberDisplayer()).toBeTruthy();
  });

  it('should calculate the string representation correctly for no numbers', () => {
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(undefined)).toEqual('?') //undefined
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(NaN)).toEqual('?') //undefined
  });

  it('should calculate the string representation correctly for short numbers', () => {
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(-0.5)).toEqual('-0.5')
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(0.5)).toEqual('0.5')
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(-0.56)).toEqual('-0.56')
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(0.56)).toEqual('0.56')
  });

  it('should truncate the string representation correctly for longer numbers', () => {
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(-0.567)).toEqual('-0.56..')
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(0.567)).toEqual('0.56..')
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(-0.567234)).toEqual('-0.56..')
    expect(NumberDisplayer.displayNumWith1DigitBeforeSep(0.567234)).toEqual('0.56..')
  })
});
