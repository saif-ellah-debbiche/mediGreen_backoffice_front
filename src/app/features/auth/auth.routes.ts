import { Routes } from '@angular/router';
import { redirectIfLoggedInGuard } from '../../core/guards/redirect-if-logged-in.guard';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent, // centered card layout shared by all auth pages
    canActivate: [redirectIfLoggedInGuard],
    // guard is on the parent — it applies to ALL children automatically
    children: [
    //   {
    //     path: 'login',
    //     loadComponent: () =>
    //       import('./login/login.component').then(m => m.LoginComponent)
    //   },
    //   {
    //     path: 'forgot-password',
    //     loadComponent: () =>
    //       import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    //   },
    //   {
    //     path: 'reset-password',
    //     // this page is reached via a link in an email, with a token in the URL
    //     // e.g. /auth/reset-password?token=abc123
    //     loadComponent: () =>
    //       import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    //   },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];