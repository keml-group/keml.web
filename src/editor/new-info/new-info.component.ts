import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {InfoComponent} from "../info/info.component";
import {NewInformation} from "../../shared/models/keml/msg-info";
import {PositionHelper} from "../../shared/models/graphical/position-helper";
import {SVGAccessService} from "../../shared/services/svg-access.service";

@Component({
  selector: '[newInfoG]',
  templateUrl: './new-info.component.svg',
  styleUrl: './new-info.component.css'
})
export class NewInfoComponent extends InfoComponent implements AfterViewInit {
  @Input() override info!: NewInformation;

  @ViewChild("me") me!: ElementRef<SVGGraphicsElement>;


  constructor(private service: SVGAccessService){
    super();
  }

  ngAfterViewInit(): void {
    console.log('My name is '+this.info.gId+':')
    console.log('my absolute position is '+PositionHelper.absolutePosition(this.me.nativeElement).toString())
    console.log('my absolute position by id is '+PositionHelper.absolutePosition(this.service.getElemById(this.info.gId+'-main')!).toString())

  }

}
