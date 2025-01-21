import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgDetailsComponent } from './msg-details.component';
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {ReceiveMessage} from "../../../shared/models/keml/msg-info";
import {ConversationPartner} from "../../../shared/models/keml/conversation-partner";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('MsgDetailsComponent', () => {
  let component: MsgDetailsComponent;
  let fixture: ComponentFixture<MsgDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MsgDetailsComponent],
      providers: [
        {provide: MatDialogRef, useValue: {}},
      ],
      imports: [MatIcon],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgDetailsComponent);
    component = fixture.componentInstance;
    component.msg = new ReceiveMessage(new ConversationPartner(), 0,'msg')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
