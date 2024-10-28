import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreknowledgeComponent } from './info.component';

describe('InfoComponent', () => {
  let component: PreknowledgeComponent;
  let fixture: ComponentFixture<PreknowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreknowledgeComponent]
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
