import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Message} from "../../../shared/models/keml/msg-info";

@Component({
  selector: '[msg-inner]',
  templateUrl: './msg-inner.component.svg',
  styleUrl: './msg-inner.component.css'
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
