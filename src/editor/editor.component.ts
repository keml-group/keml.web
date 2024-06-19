import {Component, ViewChild} from '@angular/core';
import {
  BpmnDiagrams,
  Diagram,
  DiagramComponent,
  FlowShapeModel,
  FlowShapes,
  NodeModel, SnapConstraints, SnapSettingsModel, TextModel
} from "@syncfusion/ej2-angular-diagrams";


Diagram.Inject(BpmnDiagrams);

@Component({
  selector: 'keml-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

}
