import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild,} from '@angular/core';
import {
  BpmnDiagramsService,
  BpmnShapeModel,
  DiagramComponent,
  FlowShapeModel,
  IExportOptions
} from "@syncfusion/ej2-angular-diagrams";
import { ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import {ModelIOService} from "../shared/services/model-io.service";
import {DiagramService} from "../shared/services/diagram.service";
import {DiagramIoService} from "../shared/services/diagram-io.service";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [BpmnDiagramsService, ModelIOService, DiagramService, DiagramIoService]
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
    private diagramIoService: DiagramIoService,
  ) {}

  openKeml() {
    document.getElementById('openfile1')?.click();
  }

  openDiagramJson() {
    document.getElementById('openDia')?.click();
  }

  openFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const readFile = files[0].text();
    readFile.then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      const conv = this.modelIOService.loadKEML(txt);
      this.diagramService.loadConversationAsDiagram(conv, this.diagram)
    });
  }

  saveImg() {
    let options: IExportOptions = {mode: 'Download', format: 'SVG', fileName: 'keml.svg'};
    this.diagram.exportDiagram(options);
  }

  saveDiagramJSON() {
    const jsonString = this.diagram.saveDiagram();
    this.diagramIoService.saveDiagram(jsonString, 'diagram.json');
  }

  loadDiagramJSON(event: Event) {
    this.diagramIoService.loadDiagram(event).then(diagramStr => {
      this.diagram.loadDiagram(diagramStr);
    })
  }
}
