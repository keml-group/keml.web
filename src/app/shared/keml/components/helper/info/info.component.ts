import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Information, InformationLink} from "@app/shared/keml/models/core/msg-info";
import {SVGAccessService, DraggableComponent, Dragger} from "ngx-svg-graphics";
import {InfoInnerComponent} from "@app/shared/keml/components/helper/info-inner/info-inner.component";
import {InformationLinkComponent} from "@app/shared/keml/components/information-link/information-link.component";
import {NgForOf} from "@angular/common";

@Component({
    selector: '[infoG]',
    templateUrl: './info.component.svg',
    styleUrl: './info.component.css',
  imports: [InfoInnerComponent, InformationLinkComponent, NgForOf]
})
export class InfoComponent extends DraggableComponent<Information> implements OnInit {
  @Input() info!: Information;
  @Input() showTrust = false;
  @Output() chooseInfoLink = new EventEmitter<InformationLink>();

  constructor(
    svgAccessService: SVGAccessService,
  ) {
    super(svgAccessService);
  }

  ngOnInit() {
    this.elem = this.info;
    this.elemDragger = new Dragger(this.elem);
  }

  public clickInfo(event: MouseEvent) {
    this.clickElem(event)
  }

  chooseLink(link: InformationLink) {
    this.chooseInfoLink.emit(link)
  }

}
