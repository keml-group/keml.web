import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import {DiagramAllModule} from "@syncfusion/ej2-angular-diagrams";
import { ToolbarAllModule } from '@syncfusion/ej2-angular-navigations';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(waitForAsync (() => {
    TestBed.configureTestingModule({
      imports: [DiagramAllModule, ToolbarAllModule],
      declarations: [EditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
