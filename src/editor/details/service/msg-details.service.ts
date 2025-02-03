import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Message} from "../../../shared/models/keml/msg-info";
import {MsgDetailsComponent} from "../msg-details/msg-details.component";

@Injectable({
  providedIn: 'root'
})
export class MsgDetailsService {

  constructor(
    private dialog: MatDialog,
  ) {}

  openMessageDetails(msg: Message) {
    const dialogRef = this.dialog.open(
      MsgDetailsComponent,
      {width: '40%', height: '80%'}
    );
    dialogRef.componentInstance.msg = msg;
    dialogRef.componentInstance.openOtherDetails.subscribe(m => this.openMessageDetails(m))
  }
}
