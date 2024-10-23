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

  changeIsInstr():void {
    console.log('change')
    this.info.isInstruction = !this.info.isInstruction;
  }

  // todo
  computeTextColor():string {
    const name = this.getConvPartnerName();
    return name == 'LLM'? '#ccffff' : '#ffff99'
  }

  computeInstructionBGColor(): string {
    return this.info.isInstruction ? '#ffcc00' : '#99cc00'
  }

  startDrag(event: MouseEvent) {
    this.dragActive = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    console.log(this.dragStartX);
    console.log(this.dragStartY);
  }

  drag(event: MouseEvent) {
    if (this.dragActive) {
      event.preventDefault();
      var dragX = event.clientX;
      this.x+= (dragX - this.dragStartX);
      this.dragStartX = dragX;
      var dragY = event.clientY;
      this.y+= (dragY - this.dragStartY);
      this.dragStartY = dragY;
    }
  }

  endDrag() {
    this.dragActive = false;
  }

}
