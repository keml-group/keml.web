import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSvgComponent } from './person-svg.component';

describe('PersonSvgComponent', () => {
  let component: PersonSvgComponent;
  let fixture: ComponentFixture<PersonSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonSvgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
