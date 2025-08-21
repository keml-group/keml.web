import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkOverview } from './link-overview.component';
import {InformationLink, Preknowledge} from "@app/shared/keml/core/msg-info";
import {InformationLinkType} from "@app/shared/keml/json/knowledge-models";

describe('InfoLinkShortComponent', () => {
  let component: LinkOverview;
  let fixture: ComponentFixture<LinkOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkOverview);
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
