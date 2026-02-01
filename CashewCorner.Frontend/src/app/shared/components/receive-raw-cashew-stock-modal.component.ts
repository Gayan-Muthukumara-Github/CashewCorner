import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceiveRawCashewStockRequest } from '../../core/models/raw-cashew-inventory.models';
import { RawCashewResponse } from '../../core/models/raw-cashew.models';

@Component({
  selector: 'app-receive-raw-cashew-stock-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h2>📥 Receive Raw Cashew Stock</h2>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>

        <form (ngSubmit)="onSubmit()" #receiveForm="ngForm">
          <div class="modal-body">
            <div class="form-group">
              <label for="cashewTypeId">Raw Cashew Type *</label>
              <select
                id="cashewTypeId"
                name="cashewTypeId"
                [(ngModel)]="formData.cashewTypeId"
                required
                class="form-control"
              >
                <option [value]="0" disabled>Select raw cashew type...</option>
                @for (rawCashew of rawCashews; track rawCashew.cashewTypeId) {
                  <option [value]="rawCashew.cashewTypeId">
                    {{ rawCashew.cashewType }} - {{ rawCashew.cashewQuality }}
                  </option>
                }
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="quantity">Quantity (kg) *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  [(ngModel)]="formData.quantity"
                  required
                  min="0.01"
                  step="0.01"
                  class="form-control"
                  placeholder="Enter quantity in kg"
                />
              </div>

              <div class="form-group">
                <label for="location">Storage Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  [(ngModel)]="formData.location"
                  class="form-control"
                  placeholder="e.g., Warehouse A, Bin 1"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="purchaseOrderId">Purchase Order ID (Optional)</label>
              <input
                type="number"
                id="purchaseOrderId"
                name="purchaseOrderId"
                [(ngModel)]="formData.purchaseOrderId"
                class="form-control"
                placeholder="Link to purchase order"
              />
            </div>

            <div class="form-group">
              <label for="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                [(ngModel)]="formData.notes"
                class="form-control"
                rows="3"
                placeholder="Additional notes about this stock receipt..."
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="onClose()">
              Cancel
            </button>
            <button
              type="submit"
              class="btn-primary"
              [disabled]="!receiveForm.valid || isSubmitting"
            >
              {{ isSubmitting ? 'Receiving...' : '📥 Receive Stock' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 550px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: white;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .close-btn:hover {
      opacity: 1;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #374151;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    select.form-control {
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #059669, #047857);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    @media (max-width: 576px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ReceiveRawCashewStockModalComponent implements OnInit {
  @Input() rawCashews: RawCashewResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<ReceiveRawCashewStockRequest>();

  isSubmitting = false;

  formData: ReceiveRawCashewStockRequest = {
    cashewTypeId: 0,
    quantity: 0,
    location: '',
    purchaseOrderId: undefined,
    notes: '',
  };

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      cashewTypeId: 0,
      quantity: 0,
      location: '',
      purchaseOrderId: undefined,
      notes: '',
    };
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.formData.cashewTypeId && this.formData.quantity > 0) {
      this.isSubmitting = true;
      const request: ReceiveRawCashewStockRequest = {
        cashewTypeId: Number(this.formData.cashewTypeId),
        quantity: this.formData.quantity,
        location: this.formData.location || undefined,
        purchaseOrderId: this.formData.purchaseOrderId || undefined,
        notes: this.formData.notes || undefined,
      };
      this.submit.emit(request);
    }
  }

  finishSubmit(): void {
    this.isSubmitting = false;
    this.resetForm();
  }
}
