import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {InfoComponent} from "@app/shared/keml/graphical/helper/information/info/info.component";
import {InformationLink} from "@app/shared/keml/core/msg-info";
import {ArrowBetweenElemsComponent} from "ngx-svg-graphics";

@Component({
    selector: '[infoLinkG]',
    templateUrl: './information-link.component.svg',
    styleUrl: './information-link.component.css',
    imports: [ArrowBetweenElemsComponent]
})
export class InformationLinkComponent implements OnInit, OnChanges {
  @Input() infoLink!: InformationLink;
  @Output() chooseLink: EventEmitter<InformationLink> = new EventEmitter<InformationLink>();

  startRef?: InfoComponent
  endRef?: InfoComponent

  constructor() {}

  ngOnInit(): void {
    this.getStartRef()
    this.getEndRef()
  }

  ngOnChanges(){
    this.getStartRef()
    this.getEndRef()
  }

  clickLink() {
    this.chooseLink.emit(this.infoLink)
  }

  private getStartRef() {
    if(!this.startRef){
      this.startRef = (
        document.getElementById(this.infoLink.source.$gId+"-main") as unknown as InfoComponent
      )
    }
  }

  private getEndRef() {
    if(!this.endRef){
      this.endRef = (
        document.getElementById(this.infoLink.target.$gId+"-main") as unknown as InfoComponent
      )
    }
  }

}
