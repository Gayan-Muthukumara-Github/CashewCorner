import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmployeeService } from '../../../core/services/employee.service';
import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeResponse,
} from '../../../core/models/employee.models';
import { EmployeeFormModalComponent } from '../../../shared/components/employee-form-modal.component';

@Component({
  selector: 'app-admin-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeFormModalComponent],
  templateUrl: './admin-employees.component.html',
  styleUrl: './admin-employees.component.scss'
})
export class AdminEmployeesComponent implements OnInit {
  employees: EmployeeResponse[] = [];
  isLoading = false;
  errorMessage = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedEmployee: EmployeeResponse | null = null;

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
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
        this.errorMessage = err.message || 'Failed to load employees.';
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedEmployee = null;
    this.isModalOpen = true;
  }

  openEditModal(employee: EmployeeResponse): void {
    this.modalMode = 'edit';
    this.selectedEmployee = employee;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEmployee = null;
  }

  onSaveEmployee(payload: CreateEmployeeRequest | UpdateEmployeeRequest): void {
    this.errorMessage = '';

    if (this.modalMode === 'create') {
      this.employeeService.createEmployee(payload as CreateEmployeeRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadEmployees();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to create employee.';
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedEmployee) {
      this.employeeService.updateEmployee(this.selectedEmployee.employeeId, payload as UpdateEmployeeRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadEmployees();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update employee.';
        }
      });
    }
  }

  deleteEmployee(employeeId: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to delete employee.';
        }
      });
    }
  }
}
