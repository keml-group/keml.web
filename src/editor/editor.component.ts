import {Component, ViewChild, } from '@angular/core';
import {BpmnDiagramsService, BpmnShapeModel, DiagramComponent, FlowShapeModel} from "@syncfusion/ej2-angular-diagrams";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [BpmnDiagramsService]
})
export class EditorComponent {

  public terminator:FlowShapeModel =  { type: 'Flow', shape: 'Terminator'};
  public preKnowledge: BpmnShapeModel = { type: 'Bpmn', shape: 'DataSource'};
  public borderColor = 'orange';
  public borderWidth = 10;
  public style = {fill:'red',strokeColor:'green',strokeWidth:5,strokeDashArray:'2 2'};
  ngOnInit(): void {
  }
}
