import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreknowledgeComponent } from './preknowledge.component';

describe('PreknowledgeComponent', () => {
  let component: PreknowledgeComponent;
  let fixture: ComponentFixture<PreknowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreknowledgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreknowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
