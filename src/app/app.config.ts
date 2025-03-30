import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {ArrowStyleConfigurationService} from "@app/core/features/arrows/services/arrow-style-configuration.service";
import {KEMLArrowStyleConfigurationService} from "@app/shared/keml/services/kemlarrow-style-configuration.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: ArrowStyleConfigurationService,
      useClass: KEMLArrowStyleConfigurationService
    },
  ]
};
