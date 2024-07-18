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
import {IoService} from "../shared/services/io.service";

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [BpmnDiagramsService, ModelIOService, DiagramService, IoService]
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
    private ioService: IoService,
  ) {}

  openKeml() {
    document.getElementById('openKEML')?.click();
  }

  loadKeml(event: Event) {
    this.ioService.loadStringFromFile(event).then(txt => {
      //todo insert detection code for wrong files (no json, not appropriately structured
      const conv = this.modelIOService.loadKEML(txt);
      this.diagramService.loadConversationAsDiagram(conv, this.diagram)
    });
  }

  openDiagramJson() {
    document.getElementById('openDia')?.click();
  }

  loadDiagramJSON(event: Event) {
    this.ioService.loadStringFromFile(event).then(diagramStr => {
      this.diagram.loadDiagram(diagramStr);
    })
  }

  saveDiagramJSON() {
    const jsonString = this.diagram.saveDiagram();
    const contentBlob = new Blob([jsonString], {type: 'application/json'});
    this.ioService.saveFile(contentBlob, 'diagram.json');
  }

  saveImg() {
    let options: IExportOptions = {mode: 'Download', format: 'SVG', fileName: 'keml'};
    this.diagram.exportDiagram(options);
  }
}
