import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { AdminLoginComponent } from './pages/admin-login.component';
import { AdminUsersComponent } from './pages/admin-users.component';
import { PlaceholderComponent } from '../../shared/components/placeholder.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { LoginGuard } from '../../core/guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    component: AdminLoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'transactions', component: PlaceholderComponent },
      { path: 'customers', component: PlaceholderComponent },
      { path: 'reports', component: PlaceholderComponent },
      { path: 'settings', component: PlaceholderComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
