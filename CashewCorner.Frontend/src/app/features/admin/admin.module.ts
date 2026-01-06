import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './pages/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { AdminLoginComponent } from './pages/admin-login.component';
import { AdminUsersComponent } from './pages/admin-users.component';
import { AdminSuppliersComponent } from './pages/admin-suppliers.component';
import { SupplierFormModalComponent } from '../../shared/components/supplier-form-modal.component';
import { AdminCustomersComponent } from './pages/admin-customers.component';
import { CustomerFormModalComponent } from '../../shared/components/customer-form-modal.component';
import { AdminCategoriesComponent } from './pages/admin-categories.component';
import { CategoryFormModalComponent } from '../../shared/components/category-form-modal.component';
import { AdminProductsComponent } from './pages/admin-products.component';
import { ProductFormModalComponent } from '../../shared/components/product-form-modal.component';
import { AdminOrdersComponent } from './pages/admin-orders.component';
import { OrderFormModalComponent } from '../../shared/components/order-form-modal.component';
import { AdminEmployeesComponent } from './pages/admin-employees.component';
import { EmployeeFormModalComponent } from '../../shared/components/employee-form-modal.component';
import { AdminPayrollsComponent } from './pages/admin-payrolls.component';
import { PayrollFormModalComponent } from '../../shared/components/payroll-form-modal.component';
import { AdminSalesOrdersComponent } from './pages/admin-sales-orders.component';
import { SalesOrderFormModalComponent } from '../../shared/components/sales-order-form-modal.component';
import { AdminPurchaseOrdersComponent } from './pages/admin-purchase-orders.component';
import { PurchaseOrderFormModalComponent } from '../../shared/components/purchase-order-form-modal.component';
import { AdminInventoryComponent } from './pages/admin-inventory.component';
import { ReceiveStockModalComponent } from '../../shared/components/receive-stock-modal.component';
import { AdjustStockModalComponent } from '../../shared/components/adjust-stock-modal.component';
import { AdminReportsComponent } from './pages/admin-reports.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminLayoutComponent,
    AdminDashboardComponent,
    AdminLoginComponent,
    AdminUsersComponent,
    AdminSuppliersComponent,
    SupplierFormModalComponent,
    AdminCustomersComponent,
    CustomerFormModalComponent,
    AdminCategoriesComponent,
    CategoryFormModalComponent,
    AdminProductsComponent,
    ProductFormModalComponent,
    AdminOrdersComponent,
    OrderFormModalComponent,
    AdminEmployeesComponent,
    EmployeeFormModalComponent,
    AdminPayrollsComponent,
    PayrollFormModalComponent,
    AdminSalesOrdersComponent,
    SalesOrderFormModalComponent,
    AdminPurchaseOrdersComponent,
    PurchaseOrderFormModalComponent,
    AdminInventoryComponent,
    ReceiveStockModalComponent,
    AdjustStockModalComponent,
    AdminReportsComponent
  ]
})
export class AdminModule { }
