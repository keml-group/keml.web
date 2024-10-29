import {Component, Input} from '@angular/core';
import {Information} from "../../shared/models/keml/information";
import {InfoComponent} from "../info/info.component";

@Component({
  selector: '[preknowG]',
  templateUrl: './preknowledge.component.svg',
  styleUrl: './preknowledge.component.css'
})
export class PreknowledgeComponent extends InfoComponent {
  @Input() override info!: Information;
  //@Output() openDetails = new EventEmitter<Information>();


  // todo
  override computeTextColor():string {
    return '#ffff99'
  }

}
