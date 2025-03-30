import { Injectable } from '@angular/core';
import {ArrowStyleConfigurationService} from "@app/core/services/arrow-style-configuration.service";
import {ArrowStyleConfiguration} from "@app/core/features/arrows/models/arrow-style-configuration";

@Injectable({
  providedIn: 'root'
})
export class KEMLArrowStyleConfigurationService implements ArrowStyleConfigurationService {

  styleArrow(arrowType?: string): ArrowStyleConfiguration {
    return {
      color: 'black',
      dashed: [0]
    };
  }


}
