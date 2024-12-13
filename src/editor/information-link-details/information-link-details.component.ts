import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {Information, InformationLink, Preknowledge} from "../../shared/models/keml/msg-info";

@Component({
  selector: 'app-information-link-details',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './information-link-details.component.html',
  styleUrl: './information-link-details.component.css'
})
export class InformationLinkDetailsComponent {

  @Input() infoLink!: InformationLink;
  @Input() preknowledges!: Preknowledge[];
  @Input() newInfos!: Information[];

}
