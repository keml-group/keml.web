import { Injectable } from '@angular/core';
import {ArrowStyleConfigurationService} from "@app/core/features/arrows/services/arrow-style-configuration.service";
import {ArrowStyleConfiguration} from "@app/core/features/arrows/models/arrow-style-configuration";
import {ArrowTypeConfigurator} from "@app/core/features/arrows/utils/arrow-type-configurator";

@Injectable({
  providedIn: 'root'
})
export class KEMLArrowStyleConfigurationService extends ArrowStyleConfigurationService {

  override styleArrow(arrowType?: string): ArrowStyleConfiguration {
    console.log("KEML")
    return ArrowTypeConfigurator.styleArrow(arrowType)
  }


}
