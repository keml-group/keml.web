import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgOverviewComponent } from './msg-overview.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {SendMessage} from "../../../shared/models/keml/msg-info";
import {ConversationPartner} from "../../../shared/models/keml/conversation-partner";

describe('MsgOverviewComponent', () => {
  let component: MsgOverviewComponent;
  let fixture: ComponentFixture<MsgOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MsgOverviewComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgOverviewComponent);
    component = fixture.componentInstance;
    component.msg = new SendMessage(new ConversationPartner(), 0,'msg')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
