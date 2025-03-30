import {ArrowStyleConfiguration} from "@app/core/features/arrows/models/arrow-style-configuration";

export interface ArrowStyleConfigurationService {

  styleArrow(arrowType?: string): ArrowStyleConfiguration;
}
