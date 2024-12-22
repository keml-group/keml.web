import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationLinkDetailsComponent } from './information-link-details.component';

describe('InformationLinkDetailsComponent', () => {
  let component: InformationLinkDetailsComponent;
  let fixture: ComponentFixture<InformationLinkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationLinkDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformationLinkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
