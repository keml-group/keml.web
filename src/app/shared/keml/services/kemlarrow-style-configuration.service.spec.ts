import { TestBed } from '@angular/core/testing';

import { KEMLArrowStyleConfigurationService } from './kemlarrow-style-configuration.service';
import {ArrowHead, ArrowType} from "@app/shared/keml/models/arrow-heads";

describe('KEMLArrowStyleConfigurationService', () => {
  let service: KEMLArrowStyleConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KEMLArrowStyleConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set right arrowHead, color and dashed for None', () => {
    expect(service.styleArrow()).toEqual({
      dashed: [0],
      color: 'black',
      endPointer: ArrowHead.POINTER,
    })
  })

  it('should set right arrowHead, color and dashed for DASHED', () => {
    expect(service.styleArrow(ArrowType.DASHED)).toEqual({
      dashed: [5],
      color: 'black',
      endPointer: ArrowHead.POINTER,
    })
  })

  it('should set right arrowHead, color and dashed for STRONG_ATTACK', () => {
    expect(service.styleArrow(ArrowType.STRONG_ATTACK)).toEqual({
      dashed: [0],
      color: 'red',
      endPointer: ArrowHead.ATTACK,
    })
  })

});
