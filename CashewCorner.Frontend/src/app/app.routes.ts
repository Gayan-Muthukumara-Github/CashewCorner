import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./features/customer/customer.module').then(m => m.CustomerModule)
  },
  { path: '', pathMatch: 'full', redirectTo: 'customer' },
  { path: '**', redirectTo: 'customer' }
];
