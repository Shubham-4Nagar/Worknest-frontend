import { Routes } from "@angular/router";
import { roleGuard } from "./core/guards/role.guard";

export const routes:Routes =[
  //Landing Page
  {
    path:'',
    loadComponent: () =>
      import('./features/public/landing/landing')
    .then(m => m.Landing)
  },
  //Login
  {
    path:'login',
    loadComponent: () =>
      import('./features/auth/login/login')
    .then(m => m.Login)
  },
  //Register New User
  {
    path:'register',
    loadComponent: () => 
      import('./features/auth/register/register')
    .then(m => m.Register)
  },
  //Dashboard (Parent)
  {
    path:'dashboard',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout')
    .then(m => m.DashboardLayout),

    children: [
      //owner routes(Child)
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
          },
          {
            path:'bookings',
            loadComponent: () => 
              import('./features/dashboard/owner/bookings/owner-bookings')
            .then(m => m.OwnerBookings)
          }
        ]
      }
    ]
  },
  
  {
    path: '**',
    redirectTo: ''
  }
];