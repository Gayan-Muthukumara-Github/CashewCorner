import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeResponse,
} from '../../core/models/employee.models';

@Component({
  selector: 'app-employee-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form-modal.component.html',
  styleUrl: './employee-form-modal.component.scss'
})
export class EmployeeFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() employee: EmployeeResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateEmployeeRequest | UpdateEmployeeRequest>();

  employeeForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      employeeCode: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      hireDate: ['', [Validators.required]],
      salaryBase: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.employee) {
      this.employeeForm.patchValue({
        employeeCode: this.employee.employeeCode,
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
        designation: this.employee.designation,
        department: this.employee.department,
        phone: this.employee.phone,
        email: this.employee.email,
        hireDate: this.employee.hireDate.substring(0, 10),
        salaryBase: this.employee.salaryBase,
      });
      this.employeeForm.get('employeeCode')?.disable();
    } else {
      this.employeeForm.reset({
        employeeCode: '',
        firstName: '',
        lastName: '',
        designation: '',
        department: '',
        phone: '',
        email: '',
        hireDate: new Date().toISOString().substring(0, 10),
        salaryBase: 0,
      });
      this.employeeForm.get('employeeCode')?.enable();
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Employee' : `Edit Employee: ${this.employee?.fullName}`;
  }

  onClose(): void {
    this.employeeForm.reset();
    this.employeeForm.get('employeeCode')?.enable();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      Object.values(this.employeeForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.employeeForm.getRawValue();

    if (this.mode === 'create') {
      this.save.emit(formValue as CreateEmployeeRequest);
    } else {
      const updatePayload: UpdateEmployeeRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        designation: formValue.designation,
        department: formValue.department,
        phone: formValue.phone,
        email: formValue.email,
        hireDate: formValue.hireDate,
        salaryBase: formValue.salaryBase,
      };
      this.save.emit(updatePayload);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get employeeCode() { return this.employeeForm.get('employeeCode'); }
  get firstName() { return this.employeeForm.get('firstName'); }
  get lastName() { return this.employeeForm.get('lastName'); }
  get designation() { return this.employeeForm.get('designation'); }
  get department() { return this.employeeForm.get('department'); }
  get phone() { return this.employeeForm.get('phone'); }
  get email() { return this.employeeForm.get('email'); }
  get hireDate() { return this.employeeForm.get('hireDate'); }
  get salaryBase() { return this.employeeForm.get('salaryBase'); }
}
