import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
<<<<<<< HEAD
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
=======
>>>>>>> shazaan
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  const authService = inject(AuthService);
<<<<<<< HEAD
  const router = inject(Router);
  const token = authService.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        authService.clearToken();
        router.navigate(['/auth/login']);
      }
      return throwError(() => err);
    })
  );
=======
  const token = authService.getToken();
  if (!token) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
>>>>>>> shazaan
};
