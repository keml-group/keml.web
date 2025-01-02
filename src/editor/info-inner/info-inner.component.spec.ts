import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoInnerComponent } from './info-inner.component';

describe('NewInfoInnerComponent', () => {
  let component: InfoInnerComponent;
  let fixture: ComponentFixture<InfoInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoInnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
