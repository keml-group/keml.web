import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {KEMLArrowStyleConfigurationService} from "@app/shared/keml/graphical/helper/arrow-styling/kemlarrow-style-configuration.service";
import {ArrowStyleConfigurationService} from "ngx-svg-graphics";

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
