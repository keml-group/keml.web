import { Injectable } from '@angular/core';
import {Information, InformationLink, Message} from "../../../shared/models/keml/msg-info";
import {MsgDetailsComponent} from "../msg-details/msg-details.component";
import {MatDialog} from "@angular/material/dialog";
import {
  InformationLinkDetailsComponent
} from "../information-link-details/information-link-details.component";
import {ConversationPartner} from "../../../shared/models/keml/conversation-partner";
import {ConversationPartnerDetailsComponent} from "../cp-details/cp-details.component";
import {InfoDetailsComponent} from "../info-details/info-details.component";

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openMessageDetails(msg: Message) {
    const dialogRef = this.dialog.open(
      MsgDetailsComponent,
      {width: '40%', height: '80%'}
    );
    dialogRef.componentInstance.msg = msg;
    dialogRef.componentInstance.openOtherDetails.subscribe(m => this.openMessageDetails(m))
  }

  openConversationPartnerDetails(cp: ConversationPartner) {
    const dialogRef = this.dialog.open(
      ConversationPartnerDetailsComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.cp = cp;
  }

  openInfoDetails(info: Information) {
    const dialogRef = this.dialog.open(
      InfoDetailsComponent,
      {width: '40%', height: '80%'}
    );
    dialogRef.componentInstance.info = info;
  }

  openLinkCreationDialog(src?: Information, target?: Information) {
    const ref = this.dialog.open(InformationLinkDetailsComponent, {width: '40%', height: '80%'});
    ref.componentInstance.src = src;
    ref.componentInstance.target = target;
  }

  openLinkDetails(link: InformationLink) {
    const dialogRef = this.dialog.open(
      InformationLinkDetailsComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.infoLink = link;
  }

}
