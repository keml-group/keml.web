import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowMarkersComponent } from './arrow-markers.component';

describe('ArrowMarkersComponent', () => {
  let component: ArrowMarkersComponent;
  let fixture: ComponentFixture<ArrowMarkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowMarkersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArrowMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
