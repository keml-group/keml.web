import { Injectable } from '@angular/core';
import {ArrowStyleConfiguration} from "@app/core/features/arrows/models/arrow-style-configuration";

@Injectable({
  providedIn: 'root'
})
export abstract class ArrowStyleConfigurationService {

  abstract styleArrow(arrowType?: string): ArrowStyleConfiguration;
}
