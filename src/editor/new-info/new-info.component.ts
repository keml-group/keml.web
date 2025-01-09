import {Component, Input} from '@angular/core';
import {InfoComponent} from "../info/info.component";
import {NewInformation} from "../../shared/models/keml/msg-info";

@Component({
  selector: '[newInfoG]',
  templateUrl: './new-info.component.svg',
  styleUrl: './new-info.component.css'
})
export class NewInfoComponent extends InfoComponent {
  @Input() override info!: NewInformation;

}
