import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {MatDialogRef} from "@angular/material/dialog";
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Message, ReceiveMessage, Information, NewInformation, InformationLink} from "@app/shared/keml/models/core/msg-info";
import { ModelIOService } from "@app/features/editor/services/model-io.service";
import { MsgOverviewComponent } from '@app/shared/keml/components/helper/msg-overview/msg-overview.component';
import { InfoInnerComponent } from '@app/shared/keml/components/helper/info-inner/info-inner.component';
import { MsgChoiceComponent } from '@app/shared/keml/components/helper/choices/msg-choice/msg-choice.component';
import { IsInstrSvgComponent } from "@app/shared/keml/components/helper/is-instr-svg/is-instr-svg.component";
import { ArrowSvgComponent } from '@app/core/features/arrows/components/arrow-svg/arrow-svg.component';

@Component({
    selector: 'info-details',
    templateUrl: './info-details.component.html',
    styleUrl: './info-details.component.css',
    standalone: true,
    imports: [FormsModule, IsInstrSvgComponent, NgIf, MsgChoiceComponent, NgFor, InfoInnerComponent, ArrowSvgComponent, MsgOverviewComponent, MatIcon, MatTooltip]
})
export class InfoDetailsComponent implements OnInit {
  @Input() info!: Information;
  @Output() chooseLink = new EventEmitter<InformationLink>();
  @Output() chooseMsg = new EventEmitter<Message>();
  @Output() createLinkFromSrc = new EventEmitter<Information>();
  newInfo?: NewInformation;

  constructor(
    public modelIOService: ModelIOService,
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
    this.modelIOService.deleteInfo(this.info);
    this.dialogRef.close();
  }

  duplicateMe(): void {
    const newInfo = this.modelIOService.duplicateInfo(this.info);
    if (newInfo) {
      this.info = newInfo
      this.setIfNew()
    }
  }

  changeSource(receive: ReceiveMessage) {
    if (this.newInfo){
      this.modelIOService.changeInfoSource(this.newInfo, receive)
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
