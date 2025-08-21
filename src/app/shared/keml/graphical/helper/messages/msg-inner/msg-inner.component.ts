import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Message} from "@app/shared/keml/core/msg-info";
import { TextAreaSvgComponent } from "ngx-svg-graphics";
import { NgIf } from '@angular/common';
import {ArrowBetweenBoxesComponent} from "ngx-svg-graphics";

@Component({
    selector: '[msg-inner]',
    templateUrl: './msg-inner.component.svg',
    styleUrl: './msg-inner.component.css',
    imports: [NgIf, ArrowBetweenBoxesComponent, TextAreaSvgComponent]
})
export class MsgInnerComponent implements OnInit, OnChanges {
  @Input() msg!: Message;
  @Input() lengthOpt?: number;

  length!: number;

  ngOnInit() {
    this.length = this.lengthOpt ? this.lengthOpt : this.msg.counterPart.xPosition;
  }

  ngOnChanges(_: SimpleChanges) {
    this.length = this.lengthOpt ? this.lengthOpt : this.msg.counterPart.xPosition;
  }

}
