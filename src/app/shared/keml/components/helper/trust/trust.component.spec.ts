import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustComponent } from './trust.component';
import {NumberDisplayer} from "@app/core/utils/number-displayer";

describe('TrustComponent', () => {
  let component: TrustComponent;
  let fixture: ComponentFixture<TrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set color and trust4display correctly onInit', () => {
    component.trust = -0.5678
    component.ngOnInit()
    expect(component.trust4Display).toEqual('-0.56..');
    expect(component.color).toEqual('#ff6e00');
  })

  it('should set color and trust4display correctly onCHanges', () => {
    component.trust = -0.5678
    component.ngOnChanges()
    expect(component.trust4Display).toEqual('-0.56..');
    expect(component.color).toEqual('#ff6e00');
  })
});
