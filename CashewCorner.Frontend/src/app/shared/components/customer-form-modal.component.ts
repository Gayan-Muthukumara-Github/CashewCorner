import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateCustomerRequest, UpdateCustomerRequest, CustomerResponse } from '../../core/models/customer.models';

@Component({
  selector: 'app-customer-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-form-modal.component.html',
  styleUrl: './customer-form-modal.component.scss'
})
export class CustomerFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() customer: CustomerResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateCustomerRequest | UpdateCustomerRequest>();

  customerForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.customer) {
      this.customerForm.patchValue({
        name: this.customer.name,
        phone: this.customer.phone,
        email: this.customer.email,
        address: this.customer.address,
        type: this.customer.type,
      });
    } else {
      this.customerForm.reset({
        name: '',
        phone: '',
        email: '',
        address: '',
        type: '',
      });
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Customer' : `Edit Customer: ${this.customer?.name}`;
  }

  onClose(): void {
    this.customerForm.reset();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      Object.values(this.customerForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.customerForm.value;

    if (this.mode === 'create') {
      this.save.emit(formValue as CreateCustomerRequest);
    } else {
      const updatePayload: UpdateCustomerRequest = {
        name: formValue.name,
        phone: formValue.phone,
        email: formValue.email,
        address: formValue.address,
        type: formValue.type,
      };
      this.save.emit(updatePayload);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get name() { return this.customerForm.get('name'); }
  get phone() { return this.customerForm.get('phone'); }
  get email() { return this.customerForm.get('email'); }
  get address() { return this.customerForm.get('address'); }
  get type() { return this.customerForm.get('type'); }
}
