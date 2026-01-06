import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { AdminLoginComponent } from './pages/admin-login.component';
import { AdminUsersComponent } from './pages/admin-users.component';
import { AdminSuppliersComponent } from './pages/admin-suppliers.component';
import { AdminCustomersComponent } from './pages/admin-customers.component';
import { AdminCategoriesComponent } from './pages/admin-categories.component';
import { AdminProductsComponent } from './pages/admin-products.component';
import { AdminOrdersComponent } from './pages/admin-orders.component';
import { PlaceholderComponent } from '../../shared/components/placeholder.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { LoginGuard } from '../../core/guards/login.guard';
import { AdminEmployeesComponent } from './pages/admin-employees.component';
import { AdminPayrollsComponent } from './pages/admin-payrolls.component';
import { AdminSalesOrdersComponent } from './pages/admin-sales-orders.component';
import { AdminPurchaseOrdersComponent } from './pages/admin-purchase-orders.component';
import { AdminInventoryComponent } from './pages/admin-inventory.component';
import { AdminReportsComponent } from './pages/admin-reports.component';

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
      { path: 'suppliers', component: AdminSuppliersComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'transactions', component: AdminOrdersComponent },
      { path: 'customers', component: AdminCustomersComponent },
      { path: 'employees', component: AdminEmployeesComponent },
      { path: 'payrolls', component: AdminPayrollsComponent },
      { path: 'sales-orders', component: AdminSalesOrdersComponent },
      { path: 'purchase-orders', component: AdminPurchaseOrdersComponent },
      { path: 'inventory', component: AdminInventoryComponent },
      { path: 'analytics', component: AdminReportsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
