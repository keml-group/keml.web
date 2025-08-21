import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgComponent } from './msg.component';
import {ComponentRef, input, NO_ERRORS_SCHEMA} from "@angular/core";
import {SendMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

describe('SendComponent', () => {
  let component: MsgComponent;
  let componentRef: ComponentRef<MsgComponent>;
  let fixture: ComponentFixture<MsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsgComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(MsgComponent);
    component = fixture.componentInstance;
    component.msg = new SendMessage(new ConversationPartner(), 5,'msg')
    componentRef = fixture.componentRef;
    componentRef.setInput('msgTiming', component.msg.timing);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
