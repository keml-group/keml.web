import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTrustDetailsComponent } from './info-trust-details.component';
import {MatDialogRef} from "@angular/material/dialog";
import {PreKnowledge} from "@app/shared/keml/core/msg-info";

describe('InfoTrustDetailsComponent', () => {
  let component: InfoTrustDetailsComponent;
  let fixture: ComponentFixture<InfoTrustDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: {} },
      ],
      imports: [InfoTrustDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoTrustDetailsComponent);
    component = fixture.componentInstance;
    component.info = PreKnowledge.create()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
