import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationLinkComponent} from './information-link.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {InformationLink, Preknowledge} from "@app/shared/keml/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";

describe('InformationLinkComponent', () => {
  let component: InformationLinkComponent;
  let fixture: ComponentFixture<InformationLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InformationLinkComponent],
    schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationLinkComponent);
    component = fixture.componentInstance;

    let info1 = new Preknowledge()
    let info2 = new Preknowledge()
    component.infoLink = new InformationLink(info1, info2, InformationLinkType.STRONG_SUPPORT)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
