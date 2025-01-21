import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(waitForAsync (() => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatToolbar, MatIcon],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
