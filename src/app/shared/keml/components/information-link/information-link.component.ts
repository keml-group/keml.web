import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {InfoComponent} from "@app/shared/keml/components/helper/info/info.component";
import { ArrowBetweenElemsComponent } from '@app/core/features/arrows/components/arrow-between-elems/arrow-between-elems.component';
import {InformationLink} from "@app/shared/keml/models/core/msg-info";
import {ArrowStyleConfiguration} from "@app/core/features/arrows/models/arrow-style-configuration";
import {ArrowTypeConfigurator} from "@app/core/features/arrows/utils/arrow-type-configurator";

@Component({
    selector: '[infoLinkG]',
    templateUrl: './information-link.component.svg',
    styleUrl: './information-link.component.css',
    standalone: true,
    imports: [ArrowBetweenElemsComponent]
})
export class InformationLinkComponent implements OnInit, OnChanges {
  @Input() infoLink!: InformationLink;
  @Output() chooseLink: EventEmitter<InformationLink> = new EventEmitter<InformationLink>();

  startRef?: InfoComponent
  endRef?: InfoComponent
  config: ArrowStyleConfiguration=ArrowTypeConfigurator.styleArrow(this.infoLink?.type)

  constructor() {}

  ngOnInit(): void {
    this.getStartRef()
    this.getEndRef()
    this.config = ArrowTypeConfigurator.styleArrow(this.infoLink.type)
  }

  ngOnChanges(){
    this.getStartRef()
    this.getEndRef()
    this.config = ArrowTypeConfigurator.styleArrow(this.infoLink.type)
  }

  clickLink() {
    this.chooseLink.emit(this.infoLink)
  }

  private getStartRef() {
    if(!this.startRef){
      this.startRef = (
        document.getElementById(this.infoLink.source.gId+"-main") as unknown as InfoComponent
      )
    }
  }

  private getEndRef() {
    if(!this.endRef){
      this.endRef = (
        document.getElementById(this.infoLink.target.gId+"-main") as unknown as InfoComponent
      )
    }
  }

}
