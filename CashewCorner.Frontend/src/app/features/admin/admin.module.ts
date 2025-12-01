import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './pages/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { AdminLoginComponent } from './pages/admin-login.component';
import { AdminUsersComponent } from './pages/admin-users.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminLayoutComponent,
    AdminDashboardComponent,
    AdminLoginComponent,
    AdminUsersComponent
  ]
})
export class AdminModule { }
