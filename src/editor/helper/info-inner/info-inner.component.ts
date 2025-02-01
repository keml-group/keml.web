import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Information, NewInformation} from "../../../shared/models/keml/msg-info";
import { DatabaseSvgComponent } from '../database-svg/database-svg.component';
import { TextAreaSvgComponent } from '../text-area-svg/text-area-svg.component';
import { IsInstrSvgComponent } from '../is-instr-svg/is-instr-svg.component';
import { NgIf } from '@angular/common';

@Component({
    selector: '[info-inner]',
    templateUrl: './info-inner.component.svg',
    styleUrl: './info-inner.component.css',
    standalone: true,
    imports: [NgIf, IsInstrSvgComponent, TextAreaSvgComponent, DatabaseSvgComponent]
})
// todo we cannot use it on new info currently, it leads to bounding box errors on arrows
export class InfoInnerComponent implements OnInit, OnChanges {

  @Input() info!: Information
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
