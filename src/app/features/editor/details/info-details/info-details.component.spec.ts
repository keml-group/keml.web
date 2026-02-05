import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDetailsComponent } from './info-details.component';
import {MatDialogRef} from "@angular/material/dialog";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Preknowledge} from "@app/shared/keml/core/msg-info";

describe('InfoDetailsComponent', () => {
  let component: InfoDetailsComponent;
  let fixture: ComponentFixture<InfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    providers: [
        { provide: MatDialogRef, useValue: {} },
    ],
    imports: [FormsModule, InfoDetailsComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(InfoDetailsComponent);
    component = fixture.componentInstance;
    component.info = Preknowledge.create()
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
