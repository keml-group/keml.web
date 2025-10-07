import { JsonComparer } from './json-comparer';

describe('JsonComparer', () => {
  it('should create an instance', () => {
    expect(new JsonComparer()).toBeTruthy();
  });

  it('should match two empty jsons', () => {
    expect(JsonComparer.compare({}, {})
      .isLessEquals()).toEqual(true)
  })

  it('should match two string lists (no $refs)', () => {
    expect(JsonComparer.compare(['a', 'b'], ['a', 'b'])
      .isLessEquals()).toEqual(true)
  })

  it('should NOT match two reordered string lists (no $refs)', () => {
    expect(JsonComparer.compare(['a', 'b'], ['b', 'a'])
      .isLessEquals()).toEqual(false)
  })

  it('should match two reordered object lists with $refs)', () => {
    expect(JsonComparer.compare([{$ref: 'a'}, {$ref: 'b'}], [{$ref: 'b'}, {$ref:'a'}])
      .isLessEquals()).toEqual(true)
  })

  it('should NOT match two reordered object lists (no $refs)', () => {
    expect(JsonComparer.compare([{ref: 'a'}, {ref: 'b'}], [{ref: 'b'}, {ref:'a'}])
      .isLessEquals()).toEqual(false)
  })

  it('should match two objects with reordered object lists with $refs)', () => {
    let res = JsonComparer.compare({x: [{$ref: 'a'}, {$ref: 'b'}]}, {x: [{$ref: 'b'}, {$ref:'a'}]});
    expect(res.isLessEquals()).toEqual(true)
  })

  it('should NOT match two objects with reordered object lists without $refs)', () => {
    let res = JsonComparer.compare({x: [{$re: 'a'}, {$re: 'b'}]}, {x: [{$re: 'b'}, {$re:'a'}]});
    expect(res.isLessEquals()).toEqual(false)
  })
});
