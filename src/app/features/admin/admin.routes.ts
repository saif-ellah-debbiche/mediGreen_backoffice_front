import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, // sidebar + topbar + router-outlet
    canActivate: [authGuard],
    // again, one guard covers everything nested inside
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'plants',
        loadComponent: () =>
          import('./pages/plants/plants.component').then(m => m.PlantsComponent)
      },
      {
        path: 'diseases',
        loadComponent: () =>
          import('./pages/diseases/diseases.component').then(m => m.DiseasesComponent)
      },
      {
        path: 'remedies',
        loadComponent: () =>
          import('./pages/remedies/remedies.component').then(m => m.RemediesComponent)
      },
    //   {
    //     path: 'change-password',
    //     loadComponent: () =>
    //       import('./change-password/change-password.component').then(m => m.ChangePasswordComponent)
    //   },
    //   {
    //     path: 'users',
    //     loadChildren: () =>
    //       import('./users/users.routes').then(m => m.USERS_ROUTES)
    //     // users is a big section with its own sub-routes, so it gets loadChildren
    //   },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];