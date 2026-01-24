import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (req.url.includes('/auth') && req.url.includes('/admin')) {
    if (isPlatformBrowser(platformId)) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return next(req).pipe(
        catchError((error) => {
          if (error.status === 401) {
            router.navigate(['login']);
          }
          return throwError(() => error);
        }),
      );
    }
  }
  return next(req);
};
