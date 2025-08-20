import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { NgIf } from '@angular/common';
import {Information, NewInformation} from "@app/shared/keml/models/core/msg-info";
import { DatabaseSvgComponent } from '@app/shared/keml/graphical/helper/database-svg/database-svg.component';
import { TextAreaSvgComponent } from "ngx-svg-graphics";
import { IsInstrSvgComponent } from '../is-instr-svg/is-instr-svg.component';
import {TrustComponent} from "@app/shared/keml/graphical/helper/trust/trust.component";

@Component({
    selector: '[info-inner]',
    templateUrl: './info-inner.component.svg',
    styleUrl: './info-inner.component.css',
    imports: [NgIf, IsInstrSvgComponent, TextAreaSvgComponent, DatabaseSvgComponent, TrustComponent]
})
// todo we cannot use it on new info currently, it leads to bounding box errors on arrows
export class InfoInnerComponent implements OnInit, OnChanges {

  @Input() info!: Information
  @Input() showTrust : boolean = false;
  isNew = true;
  color = '#ffff99'

  ngOnInit() {
    this.determineTypeAndColor()
  }

  ngOnChanges(_: SimpleChanges) {
    this.determineTypeAndColor()
  }

  private determineTypeAndColor() {
    const source = (this.info as NewInformation).source
    if (source) {
      this.isNew = true
      this.color = source.counterPart.name == 'LLM'? '#ccffff' : '#ffff99'
      //todo maybe use different conversationPartner colors?
    } else {
      this.isNew = false
      this.color = '#ffff99'
    }
  }

}
