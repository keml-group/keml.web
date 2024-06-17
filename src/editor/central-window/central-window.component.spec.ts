import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralWindowComponent } from './central-window.component';

describe('CentralWindowComponent', () => {
  let component: CentralWindowComponent;
  let fixture: ComponentFixture<CentralWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentralWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CentralWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
