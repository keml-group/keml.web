import {Component, Input} from '@angular/core';
import {Message} from "@app/shared/keml/models/core/msg-info";
import { TextAreaSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/text-area-svg/text-area-svg.component';
import { PersonSvgComponent } from '@app/shared/keml/components/helper/svg-base-components/person-svg/person-svg.component';
import { MsgInnerComponent } from '../msg-inner/msg-inner.component';

@Component({
    selector: '[msg-overview]',
    templateUrl: './msg-overview.component.svg',
    styleUrl: './msg-overview.component.css',
    imports: [MsgInnerComponent, PersonSvgComponent, TextAreaSvgComponent]
})
export class MsgOverviewComponent {
  @Input() msg!: Message;

}
