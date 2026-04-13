import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const redirectIfLoggedInGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).isLoggedIn();

  if (!isLoggedIn) {
    return true; // not logged in — fine, show the login page
  }

  // Already logged in — no reason to be here, send them to the app
  return inject(Router).createUrlTree(['/admin/dashboard']);
};
