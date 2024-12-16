import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationLinkComponent } from './information-link.component';

describe('InformationLinkComponent', () => {
  let component: InformationLinkComponent;
  let fixture: ComponentFixture<InformationLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
