import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (authService.getToken()) {
    return true;
  }

  const router = inject(Router);
  return router.parseUrl('/auth/login');
};
