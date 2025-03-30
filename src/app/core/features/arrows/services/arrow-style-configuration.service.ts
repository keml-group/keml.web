import { Injectable } from '@angular/core';
import {ArrowStyleConfiguration} from "@app/core/features/arrows/models/arrow-style-configuration";

@Injectable({
  providedIn: 'root'
})
export class ArrowStyleConfigurationService {

  constructor() { }

  styleArrow(arrowType?: string): ArrowStyleConfiguration {
    return {
      color: 'black',
      dashed: [0]
    };
  }
}
