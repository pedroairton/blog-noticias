import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  // temporariamente
  // return true

  if(authService.isSuperAdmin().subscribe({
    next: (response) => {
      if(response) {
        return true;
      }
      return false;
    },
    error: (error) => {
      console.error(error);
      return false;
    }
  }))
  
  router.navigate(['/admin/dashboard'])
  return false;
};
