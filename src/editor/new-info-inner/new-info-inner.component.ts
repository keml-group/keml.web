import {Component, Input} from '@angular/core';
import {NewInformation} from "../../shared/models/keml/msg-info";

@Component({
  selector: '[new-info-inner]',
  templateUrl: './new-info-inner.component.svg',
  styleUrl: './new-info-inner.component.css'
})
// todo we cannot use it on new info currently, it leads to bounding box errors on arrows
export class NewInfoInnerComponent {

  @Input() info!: NewInformation

  computeTextColor():string {
    const name = this.getConvPartnerName();
    return name == 'LLM'? '#ccffff' : '#ffff99'
  }

  // todo later use color here, then this is main method
  getConvPartnerName(): string {
    const source = (this.info as NewInformation).source
    if(source ) {
      return source.counterPart.name; //todo use color
    } else return 'author'; //give colors here already, currently we use the template vehicle
  }

}
