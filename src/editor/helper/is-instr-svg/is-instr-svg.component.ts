import {Component, Input} from '@angular/core';
import {Information} from "../../../shared/models/keml/msg-info";
import { PersonSvgComponent } from '../person-svg/person-svg.component';
import { NgIf } from '@angular/common';

@Component({
    selector: '[is-instr]',
    templateUrl: './is-instr-svg.component.svg',
    styleUrl: './is-instr-svg.component.css',
    standalone: true,
    imports: [NgIf, PersonSvgComponent]
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
