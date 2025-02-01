import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreknowledgeComponent } from './preknowledge.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Preknowledge} from "../../shared/models/keml/msg-info";

describe('PreknowledgeComponent', () => {
  let component: PreknowledgeComponent;
  let fixture: ComponentFixture<PreknowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PreknowledgeComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(PreknowledgeComponent);
    component = fixture.componentInstance;
    component.info = new Preknowledge()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
