import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoInnerComponent } from './info-inner.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Preknowledge} from "@app/shared/keml/models/core/msg-info";

describe('NewInfoInnerComponent', () => {
  let component: InfoInnerComponent;
  let fixture: ComponentFixture<InfoInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfoInnerComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(InfoInnerComponent);
    component = fixture.componentInstance;
    component.info = new Preknowledge()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
