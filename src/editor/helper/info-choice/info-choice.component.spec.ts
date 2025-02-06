import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoChoiceComponent } from './info-choice.component';

describe('InfoChoiceComponent', () => {
  let component: InfoChoiceComponent;
  let fixture: ComponentFixture<InfoChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfoChoiceComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(InfoChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
