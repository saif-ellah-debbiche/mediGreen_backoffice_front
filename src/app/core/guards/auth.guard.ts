import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).isLoggedIn();

  if (isLoggedIn) {
    console.log("logged in ")
    return true;
  }

  // Not logged in — send to login and remember where they were trying to go
  // so after login we can redirect them back
  return inject(Router).createUrlTree(['/auth/login']);
};
