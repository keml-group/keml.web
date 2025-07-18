import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {SVGAccessService} from "ngx-arrows";
import {Positionable} from "@app/core/features/positionable/positionable";
import {Referencable} from "emfular";

@Component({
  imports: [],
  selector: '[draggable]',
  templateUrl: './draggable.component.svg',
  styleUrl: './draggable.component.css'
})
export abstract class DraggableComponent<T extends Positionable & Referencable> implements AfterViewInit {

  @Output() chooseElem = new EventEmitter<T>();

  elem!: T;


  dragActive = false;
  wasReallyDragged = false;
  dragStartX: number = 0;
  dragStartY: number = 0;

  protected constructor(
    protected svgAccessService: SVGAccessService
  ) {}

  ngAfterViewInit() {
    this.svgAccessService.notifyPositionChange(this.elem.gId)
  }

  startDrag(event: MouseEvent) {
    console.log('startDrag');
    this.dragActive = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
  }

  drag(event: MouseEvent) {
    if (this.dragActive) {
      this.wasReallyDragged = true;
      event.preventDefault();
      const dragX = event.clientX;
      this.elem.position.x+= (dragX - this.dragStartX);
      this.dragStartX = dragX;
      const dragY = event.clientY;
      this.elem.position.y+= (dragY - this.dragStartY);
      this.dragStartY = dragY;
      this.svgAccessService.notifyPositionChange(this.elem.gId)
    }
  }

  endDrag(event: MouseEvent) {
    console.log('endDrag');
    this.dragActive = false;
    // todo was working for click vs drag, not now setTimeout(() => {this.dragActive = false;}, 50);
    event.preventDefault();
  }

  clickElem(event: MouseEvent) {
    if (this.wasReallyDragged) {
      this.wasReallyDragged = false;
    } else {
      this.chooseElem.emit(this.elem);
      event.preventDefault();
    }
  }


}
