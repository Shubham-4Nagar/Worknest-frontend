import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Login } from '../auth/login/login';
// import { RegisterComponent } from '../auth/register/register';

export const PUBLIC_ROUTES: Routes = [
  { path: '', component: Landing},
  { path: 'login', component: Login },
//   { path: 'register', component: RegisterComponent }
];