import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PayrollService } from '../../../core/services/payroll.service';
import { EmployeeService } from '../../../core/services/employee.service';
import {
  CreatePayrollRequest,
  PayrollResponse,
} from '../../../core/models/payroll.models';
import { EmployeeResponse } from '../../../core/models/employee.models';
import { PayrollFormModalComponent } from '../../../shared/components/payroll-form-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-payrolls',
  standalone: true,
  imports: [CommonModule, FormsModule, PayrollFormModalComponent],
  templateUrl: './admin-payrolls.component.html',
  styleUrl: './admin-payrolls.component.scss'
})
export class AdminPayrollsComponent implements OnInit {
  payrolls: PayrollResponse[] = [];
  employees: EmployeeResponse[] = [];
  isLoading = false;
  errorMessage = '';
  filterMode: 'all' | 'unpaid' | 'employee' = 'all';
  selectedEmployeeId: number | null = null;

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedPayroll: PayrollResponse | null = null;

  constructor(
    private readonly payrollService: PayrollService,
    private readonly employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadPayrolls();
    this.loadEmployees();
  }

  loadPayrolls(): void {
    this.isLoading = true;
    this.errorMessage = '';

    let payrollObservable: Observable<PayrollResponse[]>;

    if (this.filterMode === 'unpaid') {
      payrollObservable = this.payrollService.getUnpaidPayrolls();
    } else if (this.filterMode === 'employee' && this.selectedEmployeeId) {
      payrollObservable = this.payrollService.getEmployeePayrolls(this.selectedEmployeeId);
    } else {
      payrollObservable = this.payrollService.getAllPayrolls();
    }

    payrollObservable.subscribe({
      next: (payrolls) => {
        this.payrolls = payrolls;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load payrolls.';
        this.isLoading = false;
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
      }
    });
  }

  onFilterChange(): void {
    if (this.filterMode !== 'employee') {
      this.selectedEmployeeId = null;
    }
    this.loadPayrolls();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedPayroll = null;
    this.isModalOpen = true;
  }

  openEditModal(payroll: PayrollResponse): void {
    // No direct edit API for payroll, so this might not be used, or it could open a read-only view
    this.modalMode = 'edit';
    this.selectedPayroll = payroll;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPayroll = null;
  }

  onGeneratePayroll(payload: CreatePayrollRequest): void {
    this.errorMessage = '';
    this.payrollService.generatePayroll(payload).subscribe({
      next: () => {
        this.closeModal();
        this.loadPayrolls();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to generate payroll.';
      }
    });
  }
}
