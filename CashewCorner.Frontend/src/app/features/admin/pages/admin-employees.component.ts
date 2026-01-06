import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmployeeService } from '../../../core/services/employee.service';
import { DutyService } from '../../../core/services/duty.service';
import { SalesOrderService } from '../../../core/services/sales-order.service';
import { PurchaseOrderService } from '../../../core/services/purchase-order.service';
import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeResponse,
} from '../../../core/models/employee.models';
import {
  EmployeeDutyResponse,
  CreateEmployeeDutyRequest,
} from '../../../core/models/duty.models';
import { SalesOrderResponse } from '../../../core/models/sales-order.models';
import { PurchaseOrderResponse } from '../../../core/models/purchase-order.models';
import { EmployeeFormModalComponent } from '../../../shared/components/employee-form-modal.component';
import { EmployeeDutiesListComponent } from '../../../shared/components/employee-duties-list.component';
import { AssignDutyModalComponent } from '../../../shared/components/assign-duty-modal.component';
import { DutyStatusModalComponent } from '../../../shared/components/duty-status-modal.component';

@Component({
  selector: 'app-admin-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmployeeFormModalComponent,
    EmployeeDutiesListComponent,
    AssignDutyModalComponent,
    DutyStatusModalComponent,
  ],
  templateUrl: './admin-employees.component.html',
  styleUrl: './admin-employees.component.scss'
})
export class AdminEmployeesComponent implements OnInit {
  employees: EmployeeResponse[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedEmployee: EmployeeResponse | null = null;

  // Details modal
  showDetailsModal = false;
  employeeDuties: EmployeeDutyResponse[] = [];
  dutiesLoading = false;
  salesOrders: SalesOrderResponse[] = [];
  purchaseOrders: PurchaseOrderResponse[] = [];

  // Assign duty modal
  assignDutyModalOpen = false;

  // Duty status modal
  dutyStatusModalOpen = false;
  selectedDuty: EmployeeDutyResponse | null = null;

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly dutyService: DutyService,
    private readonly salesOrderService: SalesOrderService,
    private readonly purchaseOrderService: PurchaseOrderService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadSalesOrders();
    this.loadPurchaseOrders();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.errorMessage = err.error?.message || err.message || 'Failed to load employees.';
        this.isLoading = false;
      }
    });
  }

  loadSalesOrders(): void {
    this.salesOrderService.getAllSalesOrders().subscribe({
      next: (orders) => {
        this.salesOrders = orders;
      },
      error: (err) => {
        console.error('Error loading sales orders:', err);
      }
    });
  }

  loadPurchaseOrders(): void {
    this.purchaseOrderService.getAllPurchaseOrders().subscribe({
      next: (orders) => {
        this.purchaseOrders = orders;
      },
      error: (err) => {
        console.error('Error loading purchase orders:', err);
      }
    });
  }

  loadEmployeeDuties(employeeId: number): void {
    this.dutiesLoading = true;
    this.dutyService.getEmployeeDuties(employeeId).subscribe({
      next: (duties) => {
        this.employeeDuties = duties;
        this.dutiesLoading = false;
      },
      error: (err) => {
        console.error('Error loading duties:', err);
        this.dutiesLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.clearMessages();
    this.modalMode = 'create';
    this.selectedEmployee = null;
    this.isModalOpen = true;
  }

  openEditModal(employee: EmployeeResponse): void {
    this.clearMessages();
    this.modalMode = 'edit';
    this.selectedEmployee = employee;
    this.isModalOpen = true;
  }

  openEmployeeDetails(employee: EmployeeResponse): void {
    this.selectedEmployee = employee;
    this.showDetailsModal = true;
    this.loadEmployeeDuties(employee.employeeId);
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedEmployee = null;
    this.employeeDuties = [];
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEmployee = null;
  }

  openAssignDutyModal(): void {
    this.assignDutyModalOpen = true;
  }

  closeAssignDutyModal(): void {
    this.assignDutyModalOpen = false;
  }

  openDutyStatusModal(duty: EmployeeDutyResponse): void {
    this.selectedDuty = duty;
    this.dutyStatusModalOpen = true;
  }

  closeDutyStatusModal(): void {
    this.dutyStatusModalOpen = false;
    this.selectedDuty = null;
  }

  onSaveEmployee(payload: CreateEmployeeRequest | UpdateEmployeeRequest): void {
    this.clearMessages();

    if (this.modalMode === 'create') {
      this.employeeService.createEmployee(payload as CreateEmployeeRequest).subscribe({
        next: (response) => {
          this.successMessage = `Employee ${response.fullName} created successfully!`;
          this.closeModal();
          this.loadEmployees();
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (err) => {
          console.error('Error creating employee:', err);
          this.errorMessage = err.error?.message || err.message || 'Failed to create employee.';
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedEmployee) {
      this.employeeService.updateEmployee(this.selectedEmployee.employeeId, payload as UpdateEmployeeRequest).subscribe({
        next: (response) => {
          this.successMessage = `Employee ${response.fullName} updated successfully!`;
          this.closeModal();
          this.loadEmployees();
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          this.errorMessage = err.error?.message || err.message || 'Failed to update employee.';
        }
      });
    }
  }

  onAssignDuty(payload: CreateEmployeeDutyRequest): void {
    if (!this.selectedEmployee) {
      return;
    }

    this.dutyService.assignDutyToEmployee(this.selectedEmployee.employeeId, payload).subscribe({
      next: (response) => {
        console.log('Duty assigned:', response);
        this.closeAssignDutyModal();
        this.loadEmployeeDuties(this.selectedEmployee!.employeeId);
      },
      error: (err) => {
        console.error('Error assigning duty:', err);
        this.errorMessage = err.error?.message || err.message || 'Failed to assign duty.';
      }
    });
  }

  onDutyStatusUpdated(duty: EmployeeDutyResponse): void {
    console.log('Duty status updated:', duty);
    if (this.selectedEmployee) {
      this.loadEmployeeDuties(this.selectedEmployee.employeeId);
    }
  }

  deleteEmployee(employeeId: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: () => {
          this.loadEmployees();
          this.successMessage = 'Employee deleted successfully!';
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          this.errorMessage = err.error?.message || err.message || 'Failed to delete employee.';
        }
      });
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
