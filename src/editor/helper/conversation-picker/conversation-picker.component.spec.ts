import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPickerComponent } from './conversation-picker.component';
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";

describe('ConversationPickerComponent', () => {
  let component: ConversationPickerComponent;
  let fixture: ComponentFixture<ConversationPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationPickerComponent],
      providers: [
        {provide: MatDialogRef, useValue: {}},
      ],
      imports: [MatIcon],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationPickerComponent);
    component = fixture.componentInstance;
    component.texts = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
