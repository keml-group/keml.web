import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPartnerComponent } from './conversation-partner.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {ConversationPartner} from "../../shared/models/keml/conversation-partner";

describe('ConversationPartnerComponent', () => {
  let component: ConversationPartnerComponent;
  let fixture: ComponentFixture<ConversationPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationPartnerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationPartnerComponent);
    component = fixture.componentInstance;
    component.conversationPartner = new ConversationPartner()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
