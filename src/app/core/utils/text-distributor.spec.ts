import { TextDistributor } from './text-distributor';
import {BoundingBox} from "ngx-svg-graphics";

describe('TextDistributor', () => {
  it('should create an instance', () => {
    expect(new TextDistributor()).toBeTruthy();
  });

  var bb: BoundingBox = {
    x: 20,
    y: 40,
    w: 200,
    h: 50,
  }

  it('Should return a two line distributed text', () => {
    var text = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam'
    expect(TextDistributor.distributeText(text, bb)).toEqual(
      ['Lorem ipsum dolor sit', 'amet, consetetur...']
    )
  })

  it('Should create an empty text', () => {
    var text = '   '
    expect(TextDistributor.distributeText(text, bb)).toEqual(
      ['   ']
    )
  })

  it('Should cut a word that is too long for a line', () => {
    var text =       'TooLongWordLongerLongerLongerLongerLonger, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam'
    expect(TextDistributor.distributeText(text, bb)).toEqual(
      ['TooLongWordLongerLonger...', 'consetetur sadipscing...']
    )
  })
});
