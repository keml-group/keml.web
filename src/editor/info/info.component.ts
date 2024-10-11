import {Component, Input} from '@angular/core';
import {Information, NewInformation} from "../../shared/models/knowledge-models";

@Component({
  selector: '[infoG]',
  templateUrl: './info.component.svg',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  @Input() info!: Information;

  //todo: into info?
  x=0;
  y=0;
  w=200
  h=50

  protected readonly outerWidth = outerWidth;
  protected readonly innerWidth = innerWidth;

  // todo cannot use, somehow often not set - problem in json lib?
  isNewInfo() {
    console.log(this.info)
    return this.info.eClass?.endsWith('NewInformation');
  }

  // todo later use color here, then this is main method
  getConvPartnerName(): string {
    const source = (this.info as NewInformation).source
    if(source ) {
      return source.counterPart.name; //todo use color
    } else return 'author'; //give colors here already, currently we use the template vehicle
  }

  // todo
  computeTextColor():string {
    const name = this.getConvPartnerName();
    return name == 'LLM'? '#ccffff' : '#ffff99'
  }
}
