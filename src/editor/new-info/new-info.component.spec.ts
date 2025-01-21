import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInfoComponent } from './new-info.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {NewInformation, ReceiveMessage} from "../../shared/models/keml/msg-info";
import {ConversationPartner} from "../../shared/models/keml/conversation-partner";

describe('NewInfoComponent', () => {
  let component: NewInfoComponent;
  let fixture: ComponentFixture<NewInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewInfoComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewInfoComponent);
    component = fixture.componentInstance;

    let srcMsg = new ReceiveMessage(new ConversationPartner(), 0,'msg')
    let info = new NewInformation(srcMsg, 'info')
    component.info = info

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
