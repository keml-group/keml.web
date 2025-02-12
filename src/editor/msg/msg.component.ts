import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {InformationLink, Message, SendMessage} from "../../shared/models/keml/msg-info";
import {ReceiveMessage} from "../../shared/models/keml/msg-info";
import {Information} from "../../shared/models/keml/msg-info";
import {LayoutHelper} from "../../shared/utility/layout-helper";
import {ArrowType} from "../../shared/models/graphical/arrow-heads";
import {SVGAccessService} from "../../shared/services/svg-access.service";
import { ArrowBetweenElemsComponent } from '../helper/arrow-between-elems/arrow-between-elems.component';
import { NewInfoComponent } from '../new-info/new-info.component';
import { NgIf, NgFor } from '@angular/common';
import { MsgInnerComponent } from '../helper/msg-inner/msg-inner.component';

@Component({
    selector: '[msgG]',
    templateUrl: './msg.component.svg',
    styleUrl: './msg.component.css',
    standalone: true,
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
    return LayoutHelper.computeMessageY(this.msgTiming);
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
