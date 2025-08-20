import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {InformationLink, Message, SendMessage, ReceiveMessage, Information} from "@app/shared/keml/core/msg-info";
import {LayoutingService} from "@app/features/editor/utils/layouting.service";
import {ArrowType} from "@app/shared/keml/graphical/helper/arrow-styling/arrow.models";
import { NewInfoComponent } from '@app/shared/keml/graphical/new-info/new-info.component';
import { NgIf, NgFor } from '@angular/common';
import { MsgInnerComponent } from '@app/shared/keml/graphical/helper/messages/msg-inner/msg-inner.component';
import {ArrowBetweenElemsComponent, SVGAccessService} from "ngx-svg-graphics";

@Component({
    selector: '[msgG]',
    templateUrl: './msg.component.svg',
    styleUrl: './msg.component.css',
    imports: [MsgInnerComponent, NgIf, NgFor, NewInfoComponent, ArrowBetweenElemsComponent]
})
export class MsgComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() msgTiming!: number; //extra input to be used to detect changes
  @Input() msg!: Message;
  @Input() showInfos = true;
  @Input() showInfoTrusts = false;
  @Output() chooseMsg: EventEmitter<Message> = new EventEmitter();
  @Output() chooseInfo = new EventEmitter<Information>();
  @Output() chooseInfoLink: EventEmitter<InformationLink> = new EventEmitter<InformationLink>()

  receiveMsg?: ReceiveMessage;
  sendMsg?: SendMessage;

  msgY: number = 0;

  constructor(private svgAccessService: SVGAccessService) { }

  ngOnInit() {
    if (this.msg.isSend()) {
      this.sendMsg = (this.msg as SendMessage)
    } else {
      this.receiveMsg = (this.msg as ReceiveMessage)
    }
    this.msgY = this.computeY()
  }

  ngOnChanges(_: SimpleChanges) {
    if (this.msg.isSend()) {
      this.sendMsg = (this.msg as SendMessage)
    } else {
      this.receiveMsg = (this.msg as ReceiveMessage)
    }
    this.msgY = this.computeY()
    this.svgAccessService.notifyPositionChange(this.msg.gId)
  }

  ngAfterViewInit() {
    this.svgAccessService.notifyPositionChange(this.msg.gId)
  }

  computeY(): number {
    return LayoutingService.computeMessageY(this.msgTiming);
  }

  clickMsg() {
    this.chooseMsg.emit(this.msg);
  }

  clickInfo(info: Information) {
    this.chooseInfo.emit(info);
  }

  clickInfoLink(link: InformationLink) {
    this.chooseInfoLink.emit(link);
  }

  protected readonly ArrowType = ArrowType;
}
