import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateSupplierRequest, UpdateSupplierRequest, SupplierResponse } from '../../core/models/supplier.models';

@Component({
  selector: 'app-supplier-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supplier-form-modal.component.html',
  styleUrl: './supplier-form-modal.component.scss'
})
export class SupplierFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() supplier: SupplierResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateSupplierRequest | UpdateSupplierRequest>();

  supplierForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      contactPerson: ['', [Validators.required]],
      paymentTerms: ['', [Validators.required]],
      isApproved: [false],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.supplier) {
      this.supplierForm.patchValue({
        name: this.supplier.name,
        phone: this.supplier.phone,
        email: this.supplier.email,
        address: this.supplier.address,
        contactPerson: this.supplier.contactPerson,
        paymentTerms: this.supplier.paymentTerms,
        isApproved: this.supplier.isApproved,
      });
    } else {
      this.supplierForm.reset({
        name: '',
        phone: '',
        email: '',
        address: '',
        contactPerson: '',
        paymentTerms: '',
        isApproved: false,
      });
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Supplier' : `Edit Supplier: ${this.supplier?.name}`;
  }

  onClose(): void {
    this.supplierForm.reset();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      Object.values(this.supplierForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.supplierForm.value;

    if (this.mode === 'create') {
      this.save.emit(formValue as CreateSupplierRequest);
    } else {
      const updatePayload: UpdateSupplierRequest = {
        name: formValue.name,
        phone: formValue.phone,
        email: formValue.email,
        address: formValue.address,
        contactPerson: formValue.contactPerson,
        paymentTerms: formValue.paymentTerms,
        isApproved: formValue.isApproved,
      };
      this.save.emit(updatePayload);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get name() { return this.supplierForm.get('name'); }
  get phone() { return this.supplierForm.get('phone'); }
  get email() { return this.supplierForm.get('email'); }
  get address() { return this.supplierForm.get('address'); }
  get contactPerson() { return this.supplierForm.get('contactPerson'); }
  get paymentTerms() { return this.supplierForm.get('paymentTerms'); }
}
