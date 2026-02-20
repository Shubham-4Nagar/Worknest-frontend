import { Routes } from '@angular/router';
// import { authGuard } from './core/guards/auth.guard';
// import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
//   {
//     path: 'dashboard/admin',
//     canActivate: [authGuard, roleGuard('Admin')],
//     loadComponent: () =>
//       import('./features/dashboard/admin/admin').then(m => m.Admin)
//   },
//   {
//     path: 'dashboard/owner',
//     canActivate: [authGuard, roleGuard('Owner')],
//     loadComponent: () =>
//       import('./features/dashboard/owner/owner').then(m => m.Owner)
//   },
  { path: '**', redirectTo: 'login' }
];