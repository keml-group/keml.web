import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgInnerComponent } from './msg-inner.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {SendMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

describe('MsgInnerComponent', () => {
  let component: MsgInnerComponent;
  let fixture: ComponentFixture<MsgInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsgInnerComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(MsgInnerComponent);
    component = fixture.componentInstance;
    component.msg = new SendMessage(new ConversationPartner(), 0,'msg')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
