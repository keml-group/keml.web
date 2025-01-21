import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDetailsComponent } from './info-details.component';
import {MatDialogRef} from "@angular/material/dialog";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Preknowledge} from "../../../shared/models/keml/msg-info";

describe('InfoDetailsComponent', () => {
  let component: InfoDetailsComponent;
  let fixture: ComponentFixture<InfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoDetailsComponent],
      providers: [
        {provide: MatDialogRef, useValue: {}},
      ],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoDetailsComponent);
    component = fixture.componentInstance;
    component.info = new Preknowledge()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
