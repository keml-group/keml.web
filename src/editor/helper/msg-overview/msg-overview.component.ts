import {Component, Input} from '@angular/core';
import {Message} from "../../../shared/models/keml/msg-info";
import { TextAreaSvgComponent } from '../text-area-svg/text-area-svg.component';
import { PersonSvgComponent } from '../person-svg/person-svg.component';
import { MsgInnerComponent } from '../msg-inner/msg-inner.component';

@Component({
    selector: '[msg-overview]',
    templateUrl: './msg-overview.component.svg',
    styleUrl: './msg-overview.component.css',
    standalone: true,
    imports: [MsgInnerComponent, PersonSvgComponent, TextAreaSvgComponent]
})
export class MsgOverviewComponent {
  @Input() msg!: Message;

}
