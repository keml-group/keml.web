import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorComponent } from './author.component';
import {ComponentRef, NO_ERRORS_SCHEMA} from "@angular/core";
import {Author} from "@app/shared/keml/core/author";

describe('AuthorComponent', () => {
  let component: AuthorComponent;
  let fixture: ComponentFixture<AuthorComponent>;
  let componentRef: ComponentRef<AuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AuthorComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(AuthorComponent);
    component = fixture.componentInstance;
    component.author = new Author()
    componentRef = fixture.componentRef;
    componentRef.setInput('lineLength', 5); //todo
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
