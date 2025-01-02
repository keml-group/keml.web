import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Information, NewInformation} from "../../shared/models/keml/msg-info";

@Component({
  selector: '[info-inner]',
  templateUrl: './new-info-inner.component.svg',
  styleUrl: './new-info-inner.component.css'
})
// todo we cannot use it on new info currently, it leads to bounding box errors on arrows
export class NewInfoInnerComponent implements OnInit, OnChanges {

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
