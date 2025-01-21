import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorComponent } from './author.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Author} from "../../shared/models/keml/author";

describe('AuthorComponent', () => {
  let component: AuthorComponent;
  let fixture: ComponentFixture<AuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorComponent);
    component = fixture.componentInstance;
    component.author = new Author()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
