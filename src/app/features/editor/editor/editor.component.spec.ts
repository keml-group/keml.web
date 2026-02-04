import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {EditorComponent} from './editor.component';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {KemlService} from "@app/shared/keml/edit/keml.service";
import {DetailsService} from "@app/features/editor/details/details.service";
import {Preknowledge, ReceiveMessage} from "@app/shared/keml/core/msg-info";
import {ConversationPartner} from "@app/shared/keml/core/conversation-partner";
import {newNewInfo} from "@app/shared/keml/test/TestHelper"
import {Conversation} from "@app/shared/keml/core/conversation";

describe('EditorComponent', () => {
  let kemlService: jasmine.SpyObj<KemlService>;
  let detailsService: jasmine.SpyObj<DetailsService>;
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(waitForAsync (() => {
    kemlService = jasmine.createSpyObj<KemlService>('kemlService', [
      'addNewConversationPartner',
      'addNewMessage',
      'addNewNewInfo',
      'addNewPreknowledge',
      'addInformationLink',
      'isAddNewMessageDisabled',
      'isAddNewNewInfoDisabled',
      'isLinkCreationDisabled',
      'isMoveConversationPartnerLeftDisabled',
      'isMoveConversationPartnerRightDisabled',
      'msgCount',
      'cpCount',
      'conversation'
    ]);
    kemlService.conversation = Conversation.create()
    detailsService = jasmine.createSpyObj<DetailsService>('detailsService', [
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
    const fakeMsg = new ReceiveMessage(undefined, 4);
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
    const fakePre = Preknowledge.create();
    kemlService.addNewPreknowledge.and.returnValue(fakePre);
    component.addPreknowledge();
    expect(kemlService.addNewPreknowledge).toHaveBeenCalled();
    expect(detailsService.openInfoDetails).toHaveBeenCalledOnceWith(fakePre)
  })

});
