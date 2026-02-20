import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NewInfoComponent} from './new-info.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {NewInformation, ReceiveMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";

describe('NewInfoComponent', () => {
  let component: NewInfoComponent;
  let fixture: ComponentFixture<NewInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NewInfoComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(NewInfoComponent);
    component = fixture.componentInstance;

    let srcMsg = ReceiveMessage.create(new ConversationPartner(), 0,'msg')
    component.info = NewInformation.create(srcMsg, 'info')

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
