import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {MatDialogRef} from "@angular/material/dialog";
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Message, ReceiveMessage, Information, NewInformation, InformationLink} from "@app/shared/keml/core/msg-info";
import { KemlService } from "@app/features/editor/services/keml.service";
import { MsgOverviewComponent } from '@app/shared/keml/graphical/helper/msg-overview/msg-overview.component';
import { MsgChoiceComponent } from '@app/shared/keml/graphical/helper/msg-choice/msg-choice.component';
import { IsInstrSvgComponent } from "@app/shared/keml/graphical/helper/information/is-instr-svg/is-instr-svg.component";
import {LinkOverview} from "@app/shared/keml/graphical/helper/link-overview/link-overview.component";
import {
  TrustSliderComponent
} from "@app/shared/keml/graphical/helper/trust/trust-slider/trust-slider.component";

@Component({
    selector: 'info-details',
    templateUrl: './info-details.component.html',
    styleUrl: './info-details.component.css',
  imports: [FormsModule, IsInstrSvgComponent, NgIf, MsgChoiceComponent, NgFor, MsgOverviewComponent, MatIcon, MatTooltip, LinkOverview, TrustSliderComponent]
})
export class InfoDetailsComponent implements OnInit {
  @Input() info!: Information;
  @Output() chooseLink = new EventEmitter<InformationLink>();
  @Output() chooseMsg = new EventEmitter<Message>();
  @Output() createLinkFromSrc = new EventEmitter<Information>();
  newInfo?: NewInformation;

  constructor(
    public kemlService: KemlService,
    private dialogRef: MatDialogRef<InfoDetailsComponent>,
  ) {}

  ngOnInit() {
    this.setIfNew()
  }

  private setIfNew() {
    let newInfo: NewInformation = (this.info as NewInformation)
    if(newInfo.source) {
      this.newInfo = newInfo
    } else {
      this.newInfo = undefined;
    }
  }

  closeMe() {
    this.dialogRef.close();
  }

  deleteMe() {
    this.kemlService.deleteInfo(this.info);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newInfo = this.kemlService.duplicateInfo(this.info);
    if (newInfo) {
      this.info = newInfo
      this.setIfNew()
    }
  }

  changeSource(receive: ReceiveMessage) {
    if (this.newInfo){
      this.kemlService.changeInfoSource(this.newInfo, receive)
    }
  }

  clickMsg(msg: Message) {
    this.chooseMsg.emit(msg);
  }

  clickLink(link: InformationLink) {
    this.chooseLink.emit(link);
  }

  createLink(src: Information) {
    this.createLinkFromSrc.emit(src)
  }

}
