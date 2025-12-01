import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * HTTP interceptor that automatically adds the JWT access token
 * to all outgoing API requests (except auth endpoints).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip adding token for auth endpoints (login, logout)
  if (req.url.includes('/auth/login') || req.url.includes('/auth/logout')) {
    return next(req);
  }

  const token = authService.getAccessToken();
  const tokenType = authService.getTokenType() || 'Bearer';

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `${tokenType} ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};

