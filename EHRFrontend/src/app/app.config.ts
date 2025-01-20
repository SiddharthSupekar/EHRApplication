import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { loaderInterceptor } from './Interceptor/LoaderInterceptor/loader.interceptor';
import { loginInterceptor } from './Interceptor/LoginInterceptor/login.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
              provideRouter(routes), 
              provideHttpClient(withInterceptors([loaderInterceptor,loginInterceptor])),
              provideToastr(),
              provideAnimations(),
            ]
};
