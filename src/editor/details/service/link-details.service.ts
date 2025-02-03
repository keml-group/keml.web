import { Injectable } from '@angular/core';
import {InformationLink} from "../../../shared/models/keml/msg-info";
import {InformationLinkDetailsComponent} from "../information-link-details/information-link-details.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class LinkDetailsService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openLinkDetails(link: InformationLink) {
    const dialogRef = this.dialog.open(
      InformationLinkDetailsComponent,
      {width: '40%', height: '80%'}
    )
    dialogRef.componentInstance.infoLink = link;
  }
}
