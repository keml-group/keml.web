import {Component, Input} from '@angular/core';
import {Preknowledge} from "../../shared/models/keml/msg-info";
import {InfoComponent} from "../info/info.component";
import {ArrowType} from "../../shared/models/graphical/arrow-heads";

@Component({
  selector: '[preknowG]',
  templateUrl: './preknowledge.component.svg',
  styleUrl: './preknowledge.component.css'
})
export class PreknowledgeComponent extends InfoComponent {
  @Input() override info!: Preknowledge;
  //@Output() openDetails = new EventEmitter<Information>();


  // todo
  override computeTextColor():string {
    return '#ffff99'
  }

  protected readonly ArrowType = ArrowType;
}
