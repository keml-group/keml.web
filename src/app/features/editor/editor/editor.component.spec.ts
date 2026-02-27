import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {EditorComponent} from './editor.component';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {KemlService} from "@app/shared/keml/edit/keml.service";
import {DetailsService} from "@app/features/editor/details/details.service";
import {PreKnowledge, ReceiveMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {newNewInfo} from "@app/shared/keml/test/TestHelper"
import {Conversation} from "@app/shared/keml/core/conversation";

class KemlServiceStub {
  conversation = Conversation.create();

  addNewConversationPartner = jasmine.createSpy();
  addNewMessage = jasmine.createSpy();
  addNewNewInfo = jasmine.createSpy();
  addNewPreknowledge = jasmine.createSpy();
  addInformationLink = jasmine.createSpy();
  isAddNewMessageDisabled = jasmine.createSpy();
  isAddNewNewInfoDisabled = jasmine.createSpy();
  isLinkCreationDisabled = jasmine.createSpy();
  isMoveConversationPartnerLeftDisabled = jasmine.createSpy();
  isMoveConversationPartnerRightDisabled = jasmine.createSpy();
  msgCount = jasmine.createSpy();
  cpCount = jasmine.createSpy();
}

describe('EditorComponent', () => {
  let kemlService: KemlServiceStub;
  let detailsService: jasmine.SpyObj<DetailsService>;
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(waitForAsync(() => {
    kemlService = new KemlServiceStub();
    detailsService = jasmine.createSpyObj<DetailsService>('DetailsService', [
      'openConversationPartnerDetails',
      'openMessageDetails',
      'openInfoDetails',
      'openLinkCreationDialog',
      'openLinkDetails',
    ])
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatToolbar, MatIcon, EditorComponent],
      providers: [
        { provide: KemlService, useValue: kemlService },
        { provide: DetailsService, useValue: detailsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open details after cp creation', () => {
    const fakeCp = new ConversationPartner()
    kemlService.addNewConversationPartner.and.returnValue(fakeCp);
    component.addConversationPartner()
    expect(kemlService.addNewConversationPartner).toHaveBeenCalled()
    expect(detailsService.openConversationPartnerDetails).toHaveBeenCalledOnceWith(fakeCp)
  })

  it('should open details after message creation', () => {
    const fakeMsg = new ReceiveMessage();
    kemlService.addNewMessage.and.returnValue(fakeMsg);
    component.addMessage(true)
    expect(kemlService.addNewMessage).toHaveBeenCalled();
    expect(detailsService.openMessageDetails).toHaveBeenCalledOnceWith(fakeMsg)
    component.addMessage(false)
    expect(kemlService.addNewMessage).toHaveBeenCalledTimes(2);
    expect(detailsService.openMessageDetails.calls.allArgs()[1][0]).toBe(fakeMsg);
  })

  it('should open details when new info is created', () => {
    const fakeInfo = newNewInfo();
    kemlService.addNewNewInfo.and.returnValue(fakeInfo);
    component.addNewInfo();
    expect(kemlService.addNewNewInfo).toHaveBeenCalled();
    expect(detailsService.openInfoDetails).toHaveBeenCalledOnceWith(fakeInfo);
  });

  it('should not open details when no info is created', () => {
    kemlService.addNewNewInfo.and.returnValue(undefined);
    component.addNewInfo();
    expect(kemlService.addNewNewInfo).toHaveBeenCalled();
    expect(detailsService.openInfoDetails).not.toHaveBeenCalled();
  });

  it('should open details when preknowledge is created', () => {
    const fakePre = PreKnowledge.create();
    kemlService.addNewPreknowledge.and.returnValue(fakePre);
    component.addPreknowledge();
    expect(kemlService.addNewPreknowledge).toHaveBeenCalled();
    expect(detailsService.openInfoDetails).toHaveBeenCalledOnceWith(fakePre)
  })

});
