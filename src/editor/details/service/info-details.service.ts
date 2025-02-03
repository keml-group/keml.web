import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Information} from "../../../shared/models/keml/msg-info";
import {InfoDetailsComponent} from "../info-details/info-details.component";

@Injectable({
  providedIn: 'root'
})
export class InfoDetailsService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openInfoDetails(info: Information) {
    const dialogRef = this.dialog.open(
      InfoDetailsComponent,
      {width: '40%', height: '80%'}
    );
    dialogRef.componentInstance.info = info;
  }
}
