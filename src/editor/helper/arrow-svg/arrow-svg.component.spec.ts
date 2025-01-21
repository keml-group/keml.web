import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ArrowSvgComponent} from './arrow-svg.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {BoundingBox} from "../../../shared/models/graphical/bounding-box";
import {ArrowHead, CustomArrowType} from "../../../shared/models/graphical/arrow-heads";

describe('ArrowSvgComponent', () => {
  let component: ArrowSvgComponent;
  let fixture: ComponentFixture<ArrowSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrowSvgComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    let start = new BoundingBox(50, -20, 200, 80)
    let end = new BoundingBox(80, 20, 100, 200)

    fixture = TestBed.createComponent(ArrowSvgComponent);
    component = fixture.componentInstance;
    component.start = start
    component.end = end
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set right arrowHead and dashed (when positioned)', () => {
    component.positioned = true
    component.arrowType = CustomArrowType.DASHED
    component.ngOnChanges()
    expect(component.dashed).toEqual([5])
    expect(component.endType).toEqual(ArrowHead.POINTER)
  })
});
