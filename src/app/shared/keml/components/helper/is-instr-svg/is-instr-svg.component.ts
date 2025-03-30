import {Component, Input} from '@angular/core';
import { NgIf } from '@angular/common';
import {Information} from "@app/shared/keml/models/core/msg-info";
import { PersonSvgComponent } from '@app/core/features/svg-base-components/person-svg/person-svg.component';

@Component({
    selector: '[is-instr]',
    templateUrl: './is-instr-svg.component.svg',
    styleUrl: './is-instr-svg.component.css',
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
