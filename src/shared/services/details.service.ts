import { Injectable } from '@angular/core';
import {Message} from "../models/keml/msg-info";
import {MsgDetailsComponent} from "../../editor/msg-details/msg-details.component";
import {MatDialog} from "@angular/material/dialog";
import {
  InformationLinkDetailsComponent
} from "../../editor/information-link-details/information-link-details.component";

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

  openLinkCreationDialog() {
    this.dialog.open(InformationLinkDetailsComponent, {width: '40%', height: '80%'});
  }

}
