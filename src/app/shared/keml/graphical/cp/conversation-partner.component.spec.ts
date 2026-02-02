import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPartnerComponent } from './conversation-partner.component';
import {ComponentRef, NO_ERRORS_SCHEMA} from "@angular/core";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

describe('ConversationPartnerComponent', () => {
  let component: ConversationPartnerComponent;
  let fixture: ComponentFixture<ConversationPartnerComponent>;
  let componentRef: ComponentRef<ConversationPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConversationPartnerComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(ConversationPartnerComponent);
    component = fixture.componentInstance;
    component.conversationPartner = new ConversationPartner()
      componentRef = fixture.componentRef;
    componentRef.setInput('lineLength', 5); //todo
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
