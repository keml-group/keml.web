import { Component } from '@angular/core';
import {FlowShapeModel} from "@syncfusion/ej2-angular-diagrams";

@Component({
  selector: 'central-window',
  templateUrl: './central-window.component.html',
  styleUrl: './central-window.component.css'
})
export class CentralWindowComponent {
  public terminator:FlowShapeModel =  { type: 'Flow', shape: 'Terminator'};
  public borderColor = 'orange';
  public borderWidth = 10;
  public style = {fill:'red',strokeColor:'green',strokeWidth:5,strokeDashArray:'2 2'};
  ngOnInit(): void {
  }
}
