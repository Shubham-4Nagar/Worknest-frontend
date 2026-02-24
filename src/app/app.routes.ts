import { Routes } from "@angular/router";
import { roleGuard } from "./core/guards/role.guard";

export const routes:Routes =[
  //Login
  {
    path:'login',
    loadComponent: () =>
      import('./features/auth/login/login')
    .then(m => m.Login)
  },
  //Dashboard (Parent)
  {
    path:'dashboard',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout')
    .then(m => m.DashboardLayout),

    children: [
      //owner routes
      {
        path:'owner',
        canActivate: [roleGuard('Owner')],
        children: [
          {
            path:'',
            redirectTo: 'spaces',
            pathMatch: 'full'
          },
          {
            path: 'spaces',
            loadComponent: () =>
              import('./features/dashboard/owner/dashboard/owner-dashboard')
            .then(m => m.OwnerDashboard)
          },
          {
            path:'add-space',
            loadComponent: () =>
              import('./features/dashboard/owner/add-space/add-space')
            .then(m => m.AddSpace)
          },
          {
            path:'edit-space/:id',
            loadComponent: () =>
              import('./features/dashboard/owner/edit-space/edit-space')
            .then(m => m.EditSpace)
          }
        ]
      }
    ]
  },
  //Default
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];