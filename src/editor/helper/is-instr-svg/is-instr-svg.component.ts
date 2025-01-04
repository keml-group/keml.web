import {Component, Input} from '@angular/core';
import {Information} from "../../../shared/models/keml/msg-info";

@Component({
  selector: '[is-instr]',
  templateUrl: './is-instr-svg.component.svg',
  styleUrl: './is-instr-svg.component.css'
})
export class IsInstrSvgComponent {

  @Input() info!: Information;
  @Input() w!: number;
  @Input() h!: number;

  changeIsInstr():void {
    this.info.isInstruction = !this.info.isInstruction;
  }

  computeInstructionBGColor(): string {
    return this.info.isInstruction ? '#ffcc00' : '#99cc00'
  }
}
