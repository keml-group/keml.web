import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Information, NewInformation, InformationLink} from "@app/shared/keml/models/core/msg-info";
import { TextAreaSvgComponent } from '@app/core/features/svg-base-components/text-area-svg/text-area-svg.component';
import { IsInstrSvgComponent } from '../is-instr-svg/is-instr-svg.component';
import {SVGAccessService} from "ngx-arrows";
import {DraggableComponent} from "@app/core/features/positionable/draggable/draggable.component";

@Component({
    selector: '[infoG]',
    templateUrl: './info.component.svg',
    styleUrl: './info.component.css',
    imports: [IsInstrSvgComponent, TextAreaSvgComponent]
})
export class InfoComponent extends DraggableComponent<Information> implements OnInit {
  @Input() info!: Information;
  @Output() chooseInfo = new EventEmitter<Information>();
  @Output() chooseInfoLink = new EventEmitter<InformationLink>();

  constructor(
    svgAccessService: SVGAccessService,
  ) {
    super(svgAccessService);
  }

  ngOnInit() {
    this.elem = this.info;
  }

  // todo later use color here, then this is main method
  getConvPartnerName(): string {
    const source = (this.info as NewInformation).source
    if(source ) {
      return source.counterPart.name; //todo use color
    } else return 'author'; //give colors here already, currently we use the template vehicle
  }

  // todo
  computeTextColor():string {
    const name = this.getConvPartnerName();
    return name == 'LLM'? '#ccffff' : '#ffff99'
  }


  public clickInfo(event: MouseEvent) {
    this.clickElem(event)
  }

  chooseLink(link: InformationLink) {
    this.chooseInfoLink.emit(link)
  }

}
