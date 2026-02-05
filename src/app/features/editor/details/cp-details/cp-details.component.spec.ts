import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPartnerDetailsComponent } from './cp-details.component';
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import { ConversationPartner } from "@app/shared/keml/core/conversation-partner";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('ConversationPartnerDetailsComponent', () => {
  let component: ConversationPartnerDetailsComponent;
  let fixture: ComponentFixture<ConversationPartnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    providers: [
        { provide: MatDialogRef, useValue: {} },
    ],
    imports: [MatIcon, ConversationPartnerDetailsComponent],
})
    .compileComponents();

    fixture = TestBed.createComponent(ConversationPartnerDetailsComponent);
    component = fixture.componentInstance;
    component.cp = new ConversationPartner()
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
