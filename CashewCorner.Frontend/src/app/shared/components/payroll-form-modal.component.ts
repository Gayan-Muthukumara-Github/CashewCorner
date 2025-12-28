import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CreatePayrollRequest,
  PayrollResponse,
} from '../../core/models/payroll.models';
import { EmployeeResponse } from '../../core/models/employee.models';

@Component({
  selector: 'app-payroll-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payroll-form-modal.component.html',
  styleUrl: './payroll-form-modal.component.scss'
})
export class PayrollFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() payroll: PayrollResponse | null = null;
  @Input() allEmployees: EmployeeResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreatePayrollRequest>();

  payrollForm!: FormGroup;
  netPay: number | null = null;

  constructor(private readonly fb: FormBuilder) {
    this.initializeFormGroup();
  }

  private initializeFormGroup(): void {
    this.payrollForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      periodStart: ['', [Validators.required]],
      periodEnd: ['', [Validators.required]],
      grossPay: [0, [Validators.required, Validators.min(0)]],
      deductions: [0, [Validators.required, Validators.min(0)]],
      paymentDate: ['', [Validators.required]],
      paymentMethod: ['Bank Transfer', [Validators.required]],
    });

    // Subscribe to form changes to calculate net pay in real-time
    this.payrollForm.valueChanges.subscribe(() => {
      this.calculateNetPay();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.payroll) {
      this.payrollForm.patchValue({
        employeeId: this.payroll.employeeId,
        periodStart: this.payroll.periodStart.substring(0, 10),
        periodEnd: this.payroll.periodEnd.substring(0, 10),
        grossPay: this.payroll.grossPay,
        deductions: this.payroll.deductions,
        paymentDate: this.payroll.paymentDate.substring(0, 10),
        paymentMethod: this.payroll.paymentMethod,
      });
      this.netPay = this.payroll.netPay;
      this.payrollForm.disable();
    } else {
      const today = new Date().toISOString().substring(0, 10);
      
      this.payrollForm.reset({
        employeeId: null,
        periodStart: '',
        periodEnd: '',
        grossPay: 0,
        deductions: 0,
        paymentDate: today,
        paymentMethod: 'Bank Transfer',
      });
      this.netPay = 0;
      this.payrollForm.enable();
    }
  }

  private calculateNetPay(): void {
    const grossPay = Number(this.payrollForm.get('grossPay')?.value) || 0;
    const deductions = Number(this.payrollForm.get('deductions')?.value) || 0;
    this.netPay = grossPay - deductions;
  }

  get title(): string {
    return this.mode === 'create' ? 'Generate New Payroll' : `Payroll Details: ${this.payroll?.payrollId}`;
  }

  onClose(): void {
    this.payrollForm.reset();
    this.payrollForm.enable();
    this.netPay = null;
    this.close.emit();
  }

  onSubmit(): void {
    console.log('Payroll form submit triggered');
    console.log('Form valid:', this.payrollForm.valid);
    console.log('Form value:', this.payrollForm.value);

    if (this.payrollForm.invalid) {
      Object.values(this.payrollForm.controls).forEach(control => control.markAsTouched());
      console.log('Form is invalid');
      return;
    }

    if (this.mode === 'edit') {
      // In edit mode, just close the modal
      this.onClose();
      return;
    }

    const formValue = this.payrollForm.getRawValue();

    // Ensure employeeId is a number
    const employeeId = Number(formValue.employeeId);
    if (isNaN(employeeId)) {
      console.error('Invalid employee ID');
      alert('Please select a valid employee');
      return;
    }

    const createPayload: CreatePayrollRequest = {
      employeeId: employeeId,
      periodStart: formValue.periodStart,
      periodEnd: formValue.periodEnd,
      grossPay: Number(formValue.grossPay),
      deductions: Number(formValue.deductions),
      netPay: Number(formValue.grossPay) - Number(formValue.deductions),
      paymentDate: formValue.paymentDate,
      paymentMethod: formValue.paymentMethod,
    };

    console.log('Final payroll payload:', createPayload);
    this.save.emit(createPayload);
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Form control getters
  get employeeId() { return this.payrollForm.get('employeeId'); }
  get periodStart() { return this.payrollForm.get('periodStart'); }
  get periodEnd() { return this.payrollForm.get('periodEnd'); }
  get grossPay() { return this.payrollForm.get('grossPay'); }
  get deductions() { return this.payrollForm.get('deductions'); }
  get paymentDate() { return this.payrollForm.get('paymentDate'); }
  get paymentMethod() { return this.payrollForm.get('paymentMethod'); }
}