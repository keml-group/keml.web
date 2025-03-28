import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLinkShortComponent } from './info-link-short.component';
import {InformationLink, Preknowledge} from "@app/shared/keml/models/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/models/json/knowledge-models";

describe('InfoLinkShortComponent', () => {
  let component: InfoLinkShortComponent;
  let fixture: ComponentFixture<InfoLinkShortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoLinkShortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoLinkShortComponent);
    component = fixture.componentInstance;
    let info1 = new Preknowledge()
    let info2 = new Preknowledge()
    component.link = new InformationLink(info1, info2, InformationLinkType.STRONG_SUPPORT)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
