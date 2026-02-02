import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgOverviewComponent } from './msg-overview.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {SendMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

describe('MsgOverviewComponent', () => {
  let component: MsgOverviewComponent;
  let fixture: ComponentFixture<MsgOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MsgOverviewComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(MsgOverviewComponent);
    component = fixture.componentInstance;
    component.msg = SendMessage.create(new ConversationPartner(), 0,'msg')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
