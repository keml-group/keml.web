import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AlertComponent} from "@app/core/components/alert/alert.component";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private dialog: MatDialog,
    ) { }

  alert(msg: string) {
    const dialogRef = this.dialog.open(
      AlertComponent,
      {width: '20%', height: '30%'}
    )
    dialogRef.componentInstance.message = msg;
  }
}
