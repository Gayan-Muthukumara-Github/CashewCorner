import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateEmployeeDutyRequest, EmployeeDutyResponse } from '../../core/models/duty.models';
import { SalesOrderResponse } from '../../core/models/sales-order.models';
import { PurchaseOrderResponse } from '../../core/models/purchase-order.models';

@Component({
  selector: 'app-assign-duty-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assign-duty-modal.component.html',
  styleUrl: './assign-duty-modal.component.scss'
})
export class AssignDutyModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() employeeName = '';
  @Input() salesOrders: SalesOrderResponse[] = [];
  @Input() purchaseOrders: PurchaseOrderResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateEmployeeDutyRequest>();

  dutyForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.dutyForm = this.fb.group({
      taskType: [null, [Validators.required]],
      salesOrderId: [null],
      purchaseOrderId: [null],
      startDate: ['', [Validators.required]],
      notes: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    // Set default start date to current date and time
    const now = new Date();
    const localDateTime = this.formatDateTimeLocal(now);
    
    this.dutyForm.reset({
      taskType: null,
      salesOrderId: null,
      purchaseOrderId: null,
      startDate: localDateTime,
      notes: '',
    });
  }

  private formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onClose(): void {
    this.dutyForm.reset();
    this.close.emit();
  }

  onSubmit(): void {
    console.log('Form valid:', this.dutyForm.valid);
    console.log('Form value:', this.dutyForm.value);

    if (this.dutyForm.invalid) {
      Object.values(this.dutyForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.dutyForm.value;
    
    // Convert datetime-local to ISO string
    const startDate = this.convertLocalDateTimeToISO(formValue.startDate);

    const payload: CreateEmployeeDutyRequest = {
      taskType: formValue.taskType,
      salesOrderId: formValue.salesOrderId ? Number(formValue.salesOrderId) : undefined,
      purchaseOrderId: formValue.purchaseOrderId ? Number(formValue.purchaseOrderId) : undefined,
      startDate: startDate,
      notes: formValue.notes,
    };

    console.log('Duty payload:', payload);
    this.save.emit(payload);
  }

  private convertLocalDateTimeToISO(localDateTime: string): string {
    // Convert from format "2025-01-11T08:00" to ISO 8601 with seconds
    return `${localDateTime}:00`;
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get taskType() { return this.dutyForm.get('taskType'); }
  get startDate() { return this.dutyForm.get('startDate'); }
  get notes() { return this.dutyForm.get('notes'); }
}
