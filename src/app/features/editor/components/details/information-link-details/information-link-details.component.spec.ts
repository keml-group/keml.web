import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationLinkDetailsComponent } from './information-link-details.component';
import {MatDialogRef} from "@angular/material/dialog";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('InformationLinkDetailsComponent', () => {
  let component: InformationLinkDetailsComponent;
  let fixture: ComponentFixture<InformationLinkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InformationLinkDetailsComponent],
    providers: [
        { provide: MatDialogRef, useValue: {} },
    ],
    schemas: [NO_ERRORS_SCHEMA],
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
