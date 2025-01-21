import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgComponent } from './msg.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {SendMessage} from "../../shared/models/keml/msg-info";
import {ConversationPartner} from "../../shared/models/keml/conversation-partner";

describe('SendComponent', () => {
  let component: MsgComponent;
  let fixture: ComponentFixture<MsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MsgComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgComponent);
    component = fixture.componentInstance;
    component.msgTiming = 5
    component.msg = new SendMessage(new ConversationPartner(), component.msgTiming,'msg')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
