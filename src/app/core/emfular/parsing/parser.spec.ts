import { Parser } from './parser';

describe('Parser', () => {
  it('should create an instance', () => {
    let jsonString = "{}"
    let json = JSON.parse(jsonString);
    expect(new Parser(json, new Map())).toBeTruthy();
  });
});
