import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {InformationLink} from "../../shared/models/keml/msg-info";
import {InfoComponent} from "../info/info.component";
import {DetailsService} from "../details/service/details.service";

@Component({
  selector: '[infoLinkG]',
  templateUrl: './information-link.component.svg',
  styleUrl: './information-link.component.css'
})
export class InformationLinkComponent implements OnInit, OnChanges {
  @Input() infoLink!: InformationLink;

  startRef?: InfoComponent
  endRef?: InfoComponent

  constructor(
    private detailsService: DetailsService,
  ) {}

  ngOnInit(): void {
    this.getStartRef()
    this.getEndRef()
  }

  ngOnChanges(){
    this.getStartRef()
    this.getEndRef()
  }

  openDetails() {
    this.detailsService.openLinkDetails(this.infoLink)
  }

  private getStartRef() {
    if(!this.startRef){
      this.startRef = (
        document.getElementById(this.infoLink.source.gId+"-main") as unknown as InfoComponent
      )
    }
    console.log(this.startRef)
  }

  private getEndRef() {
    if(!this.endRef){
      this.endRef = (
        document.getElementById(this.infoLink.target.gId+"-main") as unknown as InfoComponent
      )
    }
    console.log(this.endRef)
  }

}
