import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInfoInnerComponent } from './new-info-inner.component';

describe('NewInfoInnerComponent', () => {
  let component: NewInfoInnerComponent;
  let fixture: ComponentFixture<NewInfoInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewInfoInnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewInfoInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
