import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ConversationPartner} from "@app/shared/keml/models/core/conversation-partner";
import {Information, InformationLink, Message} from "@app/shared/keml/models/core/msg-info";
import {ConversationPartnerDetailsComponent} from "@app/features/editor/features/details/components/cp-details/cp-details.component";
import {MsgDetailsComponent} from "@app/features/editor/features/details/components/msg-details/msg-details.component";
import {InfoDetailsComponent} from "@app/features/editor/features/details/components/info-details/info-details.component";
import {InformationLinkDetailsComponent} from "@app/features/editor/features/details/components/information-link-details/information-link-details.component";

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openConversationPartnerDetails(cp: ConversationPartner) {
    const dialogRef = this.dialog.open(
      ConversationPartnerDetailsComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.cp = cp;
  }

  openMessageDetails(msg: Message) {
    const dialogRef = this.dialog.open(
      MsgDetailsComponent,
      {width: '40%', height: '80%'}
    );
    dialogRef.componentInstance.msg = msg;
    dialogRef.componentInstance.openOtherDetails.subscribe(m => this.openMessageDetails(m))
    dialogRef.componentInstance.openInfoDetails.subscribe(i => this.openInfoDetails(i))
  }

  openInfoDetails(info: Information) {
    const dialogRef = this.dialog.open(
      InfoDetailsComponent,
      {width: '40%', height: '80%'}
    );
    dialogRef.componentInstance.info = info;
    dialogRef.componentInstance.chooseMsg.subscribe(m => this.openMessageDetails(m))
    dialogRef.componentInstance.chooseLink.subscribe(i => this.openLinkDetails(i));
    dialogRef.componentInstance.createLinkFromSrc.subscribe(i => this.openLinkCreationDialog(i))
  }

  openLinkDetails(link: InformationLink) {
    const dialogRef = this.dialog.open(
      InformationLinkDetailsComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.infoLink = link;
  }

  openLinkCreationDialog(src?: Information, target?: Information) {
    const ref = this.dialog.open(InformationLinkDetailsComponent, {width: '40%', height: '80%'});
    ref.componentInstance.src = src;
    ref.componentInstance.target = target;
  }

}
