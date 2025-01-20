import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationPartnerDetailsComponent } from './cp-details.component';

describe('ConversationPartnerDetailsComponent', () => {
  let component: ConversationPartnerDetailsComponent;
  let fixture: ComponentFixture<ConversationPartnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConversationPartnerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationPartnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
