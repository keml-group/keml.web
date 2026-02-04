import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorComponent } from './simulator.component';
import {MatDialogRef} from "@angular/material/dialog";
import {Conversation} from "@app/shared/keml/core/conversation";

describe('SimulatorComponent', () => {
  let component: SimulatorComponent;
  let fixture: ComponentFixture<SimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: {} },
      ],
      imports: [SimulatorComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SimulatorComponent);
    component = fixture.componentInstance;
    let conv = Conversation.create();
    component.conversation = conv;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
