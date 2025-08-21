import {
  AfterViewInit,
  Component, computed,
  EventEmitter, input,
  Input, InputSignal,
  OnChanges,
  OnInit,
  Output,
  Signal, signal, effect,
  SimpleChanges, WritableSignal
} from '@angular/core';
import {InformationLink, Message, SendMessage, ReceiveMessage, Information} from "@app/shared/keml/core/msg-info";
import {LayoutingService} from "@app/features/editor/services/layouting.service";
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
  msgTiming: InputSignal<number> = input.required<number>(); //extra input that controls msgY
  @Input() msg!: Message;
  @Input() showInfos = true;
  @Input() showInfoTrusts = false;
  @Output() chooseMsg: EventEmitter<Message> = new EventEmitter();
  @Output() chooseInfo = new EventEmitter<Information>();
  @Output() chooseInfoLink: EventEmitter<InformationLink> = new EventEmitter<InformationLink>()

  receiveMsg?: ReceiveMessage;
  sendMsg?: SendMessage;

  msgY: Signal<number> = computed(() => LayoutingService.computeMessageY(this.msgTiming()).valueOf());

  constructor(private svgAccessService: SVGAccessService) {
    effect(()=> {
      console.log(`The current count is: ${this.msgY()}`);
    });
  }

  ngOnInit() {
    if (this.msg.isSend()) {
      this.sendMsg = (this.msg as SendMessage)
    } else {
      this.receiveMsg = (this.msg as ReceiveMessage)
    }
  }

  ngOnChanges(_: SimpleChanges) {
    if (this.msg.isSend()) {
      this.sendMsg = (this.msg as SendMessage)
    } else {
      this.receiveMsg = (this.msg as ReceiveMessage)
    }
    this.svgAccessService.notifyPositionChange(this.msg.gId)
  }

  ngAfterViewInit() {
    this.svgAccessService.notifyPositionChange(this.msg.gId)
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
