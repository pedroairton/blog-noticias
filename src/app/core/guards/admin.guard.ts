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
        console.log('superadmin'); 
      }
      console.log('not superadmin');
    },
    error: (error) => {
      console.error(error);
      return false;
    }
  })) {
    return true;
  }
  
  router.navigate(['/admin/dashboard'])
  return false;
};
