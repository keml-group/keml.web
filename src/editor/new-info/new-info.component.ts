import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {InfoComponent} from "../info/info.component";
import {NewInformation} from "../../shared/models/keml/msg-info";
import {ArrowType} from "../../shared/models/graphical/arrow-heads";

@Component({
  selector: '[newInfoG]',
  templateUrl: './new-info.component.svg',
  styleUrl: './new-info.component.css'
})
export class NewInfoComponent extends InfoComponent {
  @Input() override info!: NewInformation;

  @ViewChild("me") me!: ElementRef<SVGGraphicsElement>;

  protected readonly ArrowType = ArrowType;
}
