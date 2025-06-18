import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustComponent } from './trust.component';

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

  it('should calculate the string representation correctly', () => {
    component.trust = undefined
    expect(component.computeTrust4Display()).toEqual('?') //undefined
    component.trust = NaN;
    expect(component.computeTrust4Display()).toEqual('?')

    component.trust = -0.5;
    expect(component.computeTrust4Display()).toEqual('-0.5')
    component.trust = 0.5;
    expect(component.computeTrust4Display()).toEqual('0.5')
    component.trust = -0.56;
    expect(component.computeTrust4Display()).toEqual('-0.56')
    component.trust = 0.56;
    expect(component.computeTrust4Display()).toEqual('0.56')
    component.trust = -0.567;
    expect(component.computeTrust4Display()).toEqual('-0.56..')
    component.trust = 0.567;
    expect(component.computeTrust4Display()).toEqual('0.56..')
    component.trust = -0.567234;
    expect(component.computeTrust4Display()).toEqual('-0.56..')
    component.trust = 0.567234;
    expect(component.computeTrust4Display()).toEqual('0.56..')

  })
});
