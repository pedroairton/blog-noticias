import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!req.url.includes('auth') && !req.url.includes('admin')){
    return next(req);
  }
  const token = localStorage.getItem('auth_token')

  if(token){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req).pipe(
    catchError(error => {
      if(error.status === 401){
        router.navigate(['login']);
      }
      return throwError(() => error);
    })
  );
};
