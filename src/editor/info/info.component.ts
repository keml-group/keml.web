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
  @Output() chooseInfo = new EventEmitter<Information>();

  dragActive = false;
  wasReallyDragged = false;
  dragStartX: number = 0;
  dragStartY: number = 0;

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
    console.log(this.info.position.x)
    console.log(this.info.position.y)
  }

  drag(event: MouseEvent) {
    if (this.dragActive) {
      this.wasReallyDragged = true;
      event.preventDefault();
      const dragX = event.clientX;
      this.info.position.x+= (dragX - this.dragStartX);
      this.dragStartX = dragX;
      const dragY = event.clientY;
      this.info.position.y+= (dragY - this.dragStartY);
      this.dragStartY = dragY;
    }
  }

  endDrag(event: MouseEvent) {
    console.log('endDrag');
    this.dragActive = false;
    // todo was working for click vs drag, not now setTimeout(() => {this.dragActive = false;}, 50);
    event.preventDefault();
  }

  clickInfo(event: MouseEvent) {
    if (this.wasReallyDragged) {
      this.wasReallyDragged = false;
    } else {
      this.chooseInfo.emit(this.info);
      event.preventDefault();
    }
  }

}
