import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Information} from "../../shared/models/keml/msg-info";
import {NewInformation} from "../../shared/models/keml/msg-info";

@Component({
  selector: '[infoG]',
  templateUrl: './info.component.svg',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  @Input() info!: Information;
  @Output() openDetails = new EventEmitter<Information>();

  //todo: into info?
  w=200
  h=50

  dragActive = false;
  dragStartX: number = 0;
  dragStartY: number = 0;

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

  startDrag(event: MouseEvent) {
    console.log('startDrag');
    this.dragActive = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    console.log(this.info.x)
    console.log(this.info.y)
  }

  drag(event: MouseEvent) {
    if (this.dragActive) {
      event.preventDefault();
      var dragX = event.clientX;
      this.info.x+= (dragX - this.dragStartX);
      this.dragStartX = dragX;
      var dragY = event.clientY;
      this.info.y+= (dragY - this.dragStartY);
      this.dragStartY = dragY;
    }
  }

  endDrag(event: MouseEvent) {
    console.log('endDrag');
    this.dragActive = false;
    // todo was working for click vs drag, not now setTimeout(() => {this.dragActive = false;}, 50);
  }

  openInfoDetails() {
    console.log('openInfoDetails');
    this.openDetails.emit(this.info);
    /* todo: why is click not fired any more like below?
    if (!this.dragActive) {
      console.log('click');
      this.openDetails.emit(this.info);
    }*/
  }

}
