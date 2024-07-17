import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild,} from '@angular/core';
import {BpmnDiagramsService, BpmnShapeModel, DiagramComponent, FlowShapeModel} from "@syncfusion/ej2-angular-diagrams";
import { ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import {ModelIOService} from "../shared/services/model-io.service";
import {DiagramService} from "../shared/services/diagram.service";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [BpmnDiagramsService, ModelIOService, DiagramService]
})
export class EditorComponent implements OnInit, AfterViewInit {

  public terminator:FlowShapeModel =  { type: 'Flow', shape: 'Terminator'};
  public preKnowledge: BpmnShapeModel = { type: 'Bpmn', shape: 'DataSource'};
  public style = {fill:'red',strokeColor:'green',strokeWidth:5,strokeDashArray:'2 2'};

  @ViewChild("diagram") diagram!: DiagramComponent;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //console.log(this.diagram);
  }

  constructor(
    private modelIOService: ModelIOService,
    private diagramService: DiagramService,
  ) {
  }

  open() {
    document.getElementById('openfile1')?.click();
  }

  openFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const readFile = files[0].text();
    readFile.then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      const conv = this.modelIOService.loadKEML(txt);
      console.log(conv.title);
      this.diagramService.loadModel(conv, this.diagram)
    });
    console.log(files[0]);
  }
}
