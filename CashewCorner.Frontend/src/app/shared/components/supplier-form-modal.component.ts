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
      // Basic info
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: [''],
      email: ['', [Validators.email]],
      address: [''],
      contactPerson: [''],
      paymentTerms: [''],
      isApproved: [false],
      // Cashew-related fields
      cashewTypeId: [null],
      quantity: [null],
      quality: [''],
      costPerUnit: [null],
      season: [''],
      paymentMethod: [''],
      distance: [null],
      deliveryMethod: [''],
      deliveryCost: [null],
      timeTakenToReceive: [null],
      averageCostPerUnit: [null],
      averageDeliveryTime: [null],
      averageDeliveryCost: [null],
      performances: [''],
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
        // Cashew-related fields
        cashewTypeId: this.supplier.cashewTypeId,
        quantity: this.supplier.quantity,
        quality: this.supplier.quality,
        costPerUnit: this.supplier.costPerUnit,
        season: this.supplier.season,
        paymentMethod: this.supplier.paymentMethod,
        distance: this.supplier.distance,
        deliveryMethod: this.supplier.deliveryMethod,
        deliveryCost: this.supplier.deliveryCost,
        timeTakenToReceive: this.supplier.timeTakenToReceive,
        averageCostPerUnit: this.supplier.averageCostPerUnit,
        averageDeliveryTime: this.supplier.averageDeliveryTime,
        averageDeliveryCost: this.supplier.averageDeliveryCost,
        performances: this.supplier.performances,
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
        cashewTypeId: null,
        quantity: null,
        quality: '',
        costPerUnit: null,
        season: '',
        paymentMethod: '',
        distance: null,
        deliveryMethod: '',
        deliveryCost: null,
        timeTakenToReceive: null,
        averageCostPerUnit: null,
        averageDeliveryTime: null,
        averageDeliveryCost: null,
        performances: '',
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

    // Build payload, excluding null/empty optional fields
    const payload: CreateSupplierRequest | UpdateSupplierRequest = {
      name: formValue.name,
      phone: formValue.phone || undefined,
      email: formValue.email || undefined,
      address: formValue.address || undefined,
      contactPerson: formValue.contactPerson || undefined,
      paymentTerms: formValue.paymentTerms || undefined,
      cashewTypeId: formValue.cashewTypeId ?? undefined,
      quantity: formValue.quantity ?? undefined,
      quality: formValue.quality || undefined,
      costPerUnit: formValue.costPerUnit ?? undefined,
      season: formValue.season || undefined,
      paymentMethod: formValue.paymentMethod || undefined,
      distance: formValue.distance ?? undefined,
      deliveryMethod: formValue.deliveryMethod || undefined,
      deliveryCost: formValue.deliveryCost ?? undefined,
      timeTakenToReceive: formValue.timeTakenToReceive ?? undefined,
      averageCostPerUnit: formValue.averageCostPerUnit ?? undefined,
      averageDeliveryTime: formValue.averageDeliveryTime ?? undefined,
      averageDeliveryCost: formValue.averageDeliveryCost ?? undefined,
      performances: formValue.performances || undefined,
    };

    if (this.mode === 'edit') {
      (payload as UpdateSupplierRequest).isApproved = formValue.isApproved;
    }

    this.save.emit(payload);
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
  get quality() { return this.supplierForm.get('quality'); }
  get season() { return this.supplierForm.get('season'); }
  get paymentMethod() { return this.supplierForm.get('paymentMethod'); }
  get deliveryMethod() { return this.supplierForm.get('deliveryMethod'); }
  get performances() { return this.supplierForm.get('performances'); }
}
