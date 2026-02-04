import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationComponent } from './conversation.component';
import {ComponentRef} from "@angular/core";
import {Conversation} from "@app/shared/keml/core/conversation";

describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let componentRef: ComponentRef<ConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('msgCount', 5)
    componentRef.setInput('cpCount', 1)
    component.conversation = Conversation.create();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
