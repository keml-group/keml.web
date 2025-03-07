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

  it('should compute twoHexDigits', () => {
    let tests = new Map<number, string>()
    tests.set(0, '00')
    tests.set(0.5, '80')
    tests.set(0.53335, '88')
    tests.set(1, 'ff')
    tests.forEach((str, num) =>  {
      expect(component.computeTwoHexDigits(num)).toBe(str);
    })
  })

  it('should produce red', () => {
    component.trust = -1.0
    expect(component.computeColor()).toEqual('#ff0000')
  })

  it('should produce light red', () => {
    component.trust = -0.5
    expect(component.computeColor()).toEqual('#ff8000')
  })

  it('should produce green', () => {
    component.trust = 1.0
    expect(component.computeColor()).toEqual('#00ff00')
  })

  it('should produce yellow', () => {
    component.trust = 0;
    expect(component.computeColor()).toEqual('#ffff00')
  })

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
