import { Component, EventEmitter, Input, Output, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateSupplierRequest, UpdateSupplierRequest, SupplierResponse } from '../../core/models/supplier.models';
import { RawCashewService } from '../../core/services/raw-cashew.service';
import { RawCashewResponse } from '../../core/models/raw-cashew.models';

@Component({
  selector: 'app-supplier-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supplier-form-modal.component.html',
  styleUrl: './supplier-form-modal.component.scss'
})
export class SupplierFormModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() supplier: SupplierResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateSupplierRequest | UpdateSupplierRequest>();

  supplierForm: FormGroup;
  rawCashews: RawCashewResponse[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly rawCashewService: RawCashewService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: [''],
      cashewTypeId: [null],
      distance: [null],
    });
  }

  ngOnInit(): void {
    this.loadRawCashews();
  }

  private loadRawCashews(): void {
    this.rawCashewService.getRawCashews().subscribe({
      next: (cashews) => {
        this.rawCashews = cashews;
      },
      error: (error) => {
        console.error('Error loading raw cashews:', error);
      },
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
        address: this.supplier.address,
        cashewTypeId: this.supplier.cashewTypeId,
        distance: this.supplier.distance,
      });
    } else {
      this.supplierForm.reset({
        name: '',
        address: '',
        cashewTypeId: null,
        distance: null,
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
      address: formValue.address || undefined,
      cashewTypeId: formValue.cashewTypeId ?? undefined,
      distance: formValue.distance ?? undefined,
    };

    this.save.emit(payload);
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get name() { return this.supplierForm.get('name'); }
  get address() { return this.supplierForm.get('address'); }
  get cashewTypeId() { return this.supplierForm.get('cashewTypeId'); }
  get distance() { return this.supplierForm.get('distance'); }
}
