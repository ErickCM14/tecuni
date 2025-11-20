import { HttpInterceptorFn, HttpRequest, HttpHandler } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  const token = auth.getToken();
  const lang = navigator.language.split('-')[0]; // "es", "en", etc.
  console.log(lang);


  const headersConfig: Record<string, string> = {
    // 'Accept-Language': lang
    'Accept-Language': 'es'
  };

  if (token) {
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

  const cloned = req.clone({ setHeaders: headersConfig });
  return next(cloned);
  return next(req);
};
