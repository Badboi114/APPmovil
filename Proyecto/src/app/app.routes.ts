import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then((m) => m.AdminPage),
  },
  // {
  //   path: 'email-config',
  //   loadComponent: () => import('./pages/email-config/email-config.page').then((m) => m.EmailConfigPage),
  // },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
