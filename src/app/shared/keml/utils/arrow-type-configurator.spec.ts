import {ArrowTypeConfigurator} from './arrow-type-configurator';
import {ArrowHead, ArrowType} from "@app/core/features/arrows/models/arrow-heads";

describe('ArrowTypeConfigurator', () => {
  it('should create an instance', () => {
    expect(new ArrowTypeConfigurator()).toBeTruthy();
  });

  it('should set right arrowHead, color and dashed for None', () => {
    expect(ArrowTypeConfigurator.styleArrow()).toEqual({
      dashed: [0],
      color: 'black',
      endPointer: ArrowHead.POINTER,
    })
  })

  it('should set right arrowHead, color and dashed for DASHED', () => {
    expect(ArrowTypeConfigurator.styleArrow(ArrowType.DASHED)).toEqual({
      dashed: [5],
      color: 'black',
      endPointer: ArrowHead.POINTER,
    })
  })

  it('should set right arrowHead, color and dashed for STRONG_ATTACK', () => {
    expect(ArrowTypeConfigurator.styleArrow(ArrowType.STRONG_ATTACK)).toEqual({
      dashed: [0],
      color: 'red',
      endPointer: ArrowHead.ATTACK,
    })
  })
});
