import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowBetweenElemsComponent } from './arrow-between-elems.component';

describe('ArrowBetweenElemsComponent', () => {
  let component: ArrowBetweenElemsComponent;
  let fixture: ComponentFixture<ArrowBetweenElemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrowBetweenElemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowBetweenElemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
