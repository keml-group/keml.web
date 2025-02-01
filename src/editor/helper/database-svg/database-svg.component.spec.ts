import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseSvgComponent } from './database-svg.component';

describe('DatabaseSvgComponent', () => {
  let component: DatabaseSvgComponent;
  let fixture: ComponentFixture<DatabaseSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DatabaseSvgComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
