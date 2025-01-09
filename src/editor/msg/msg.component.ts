import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Message, SendMessage} from "../../shared/models/keml/msg-info";
import {ReceiveMessage} from "../../shared/models/keml/msg-info";
import {Information} from "../../shared/models/keml/msg-info";
import {LayoutHelper} from "../../shared/utility/layout-helper";
import {ArrowType} from "../../shared/models/graphical/arrow-heads";
import {SVGAccessService} from "../../shared/services/svg-access.service";

@Component({
  selector: '[msgG]',
  templateUrl: './msg.component.svg',
  styleUrl: './msg.component.css'
})
export class MsgComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() msgTiming!: number; //extra input to be used to detect changes
  @Input() msg!: Message;
  @Input() showInfos = true;
  @Output() chooseMsg: EventEmitter<Message> = new EventEmitter();
  @Output() chooseInfo = new EventEmitter<Information>();

  receiveMsg?: ReceiveMessage;
  sendMsg?: SendMessage;

  constructor(private svgAccessService: SVGAccessService) { }

  ngOnInit() {
    if (this.msg.isSend()) {
      this.sendMsg = (this.msg as SendMessage)
    } else {
      this.receiveMsg = (this.msg as ReceiveMessage)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Change '+this.msg.gId)
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

  computeY(): number {
    return LayoutHelper.computeMessageY(this.msg.timing);
  }

  clickMsg() {
    this.chooseMsg.emit(this.msg);
  }

  clickInfo(info: Information) {
    this.chooseInfo.emit(info);
  }

  protected readonly ArrowType = ArrowType;
}
