import {ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {KEMLArrowStyleConfigurationService} from "@app/shared/keml/graphical/helper/arrow-styling/kemlarrow-style-configuration.service";
import {ArrowStyleConfigurationService} from "ngx-svg-graphics";
import {KemlHistoryService} from "@app/shared/keml/edit/keml-history.service";
import {isPlatformBrowser} from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: ArrowStyleConfigurationService,
      useClass: KEMLArrowStyleConfigurationService
    },
    provideAppInitializer(()=>{
      const platformId = inject(PLATFORM_ID);
      if(isPlatformBrowser(platformId)){
        const history = inject(KemlHistoryService);
        history.init();
      }
    })
  ]
};
