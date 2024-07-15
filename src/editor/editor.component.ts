import {Component, EventEmitter, ViewChild,} from '@angular/core';
import {BpmnDiagramsService, BpmnShapeModel, DiagramComponent, FlowShapeModel} from "@syncfusion/ej2-angular-diagrams";
import { ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import {ModelIOService} from "../shared/services/model-io.service";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [BpmnDiagramsService, ModelIOService]
})
export class EditorComponent {

  public terminator:FlowShapeModel =  { type: 'Flow', shape: 'Terminator'};
  public preKnowledge: BpmnShapeModel = { type: 'Bpmn', shape: 'DataSource'};
  public borderColor = 'orange';
  public borderWidth = 10;
  public style = {fill:'red',strokeColor:'green',strokeWidth:5,strokeDashArray:'2 2'};
  ngOnInit(): void {
  }

  constructor(private modelIOService: ModelIOService) {
  }

  open() {
    document.getElementById('openfile1')?.click();
  }

  openFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const readFile = files[0].text();
    readFile.then(txt => {
      const conv = this.modelIOService.loadKEML(txt);
      console.log(conv.title);
    });
    console.log(files[0]);
  }
}
