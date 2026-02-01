import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdjustRawCashewStockRequest } from '../../core/models/raw-cashew-inventory.models';
import { RawCashewResponse } from '../../core/models/raw-cashew.models';

@Component({
  selector: 'app-adjust-raw-cashew-stock-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h2>📊 Adjust Raw Cashew Stock</h2>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>

        <form (ngSubmit)="onSubmit()" #adjustForm="ngForm">
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

            <div class="form-group">
              <label for="adjustmentType">Adjustment Type *</label>
              <select
                id="adjustmentType"
                name="adjustmentType"
                [(ngModel)]="formData.adjustmentType"
                required
                class="form-control"
              >
                <option value="" disabled>Select adjustment type...</option>
                <option value="ADD">➕ Add Stock</option>
                <option value="REMOVE">➖ Remove Stock</option>
                <option value="USAGE">🔧 Usage (Processing)</option>
                <option value="DAMAGE">⚠️ Damage/Waste</option>
                <option value="CORRECTION">✏️ Correction</option>
              </select>
            </div>

            <div class="adjustment-info" [ngClass]="getAdjustmentClass()">
              <span class="info-icon">{{ getAdjustmentIcon() }}</span>
              <span class="info-text">{{ getAdjustmentDescription() }}</span>
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
                  placeholder="e.g., Warehouse A"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="notes">Notes *</label>
              <textarea
                id="notes"
                name="notes"
                [(ngModel)]="formData.notes"
                required
                class="form-control"
                rows="3"
                placeholder="Reason for adjustment..."
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
              [disabled]="!adjustForm.valid || isSubmitting"
            >
              {{ isSubmitting ? 'Adjusting...' : '📊 Adjust Stock' }}
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
      background: linear-gradient(135deg, #f59e0b, #d97706);
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
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
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

    .adjustment-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.25rem;
      font-size: 0.9rem;
    }

    .adjustment-info.add {
      background: #d1fae5;
      color: #065f46;
    }

    .adjustment-info.remove {
      background: #fee2e2;
      color: #991b1b;
    }

    .adjustment-info.usage {
      background: #dbeafe;
      color: #1e40af;
    }

    .adjustment-info.damage {
      background: #fef3c7;
      color: #92400e;
    }

    .adjustment-info.correction {
      background: #e5e7eb;
      color: #374151;
    }

    .adjustment-info.default {
      background: #f3f4f6;
      color: #6b7280;
    }

    .info-icon {
      font-size: 1.25rem;
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
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #d97706, #b45309);
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
export class AdjustRawCashewStockModalComponent implements OnInit {
  @Input() rawCashews: RawCashewResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<AdjustRawCashewStockRequest>();

  isSubmitting = false;

  formData: AdjustRawCashewStockRequest = {
    cashewTypeId: 0,
    quantity: 0,
    adjustmentType: 'ADD',
    location: '',
    notes: '',
  };

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      cashewTypeId: 0,
      quantity: 0,
      adjustmentType: 'ADD',
      location: '',
      notes: '',
    };
  }

  getAdjustmentClass(): string {
    switch (this.formData.adjustmentType) {
      case 'ADD':
        return 'add';
      case 'REMOVE':
        return 'remove';
      case 'USAGE':
        return 'usage';
      case 'DAMAGE':
        return 'damage';
      case 'CORRECTION':
        return 'correction';
      default:
        return 'default';
    }
  }

  getAdjustmentIcon(): string {
    switch (this.formData.adjustmentType) {
      case 'ADD':
        return '➕';
      case 'REMOVE':
        return '➖';
      case 'USAGE':
        return '🔧';
      case 'DAMAGE':
        return '⚠️';
      case 'CORRECTION':
        return '✏️';
      default:
        return 'ℹ️';
    }
  }

  getAdjustmentDescription(): string {
    switch (this.formData.adjustmentType) {
      case 'ADD':
        return 'This will increase the stock quantity.';
      case 'REMOVE':
        return 'This will decrease the stock quantity.';
      case 'USAGE':
        return 'Stock used for processing/production.';
      case 'DAMAGE':
        return 'Stock lost due to damage or waste.';
      case 'CORRECTION':
        return 'Correction to match physical inventory.';
      default:
        return 'Select an adjustment type.';
    }
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
    if (
      this.formData.cashewTypeId &&
      this.formData.quantity > 0 &&
      this.formData.adjustmentType &&
      this.formData.notes
    ) {
      this.isSubmitting = true;
      const request: AdjustRawCashewStockRequest = {
        cashewTypeId: Number(this.formData.cashewTypeId),
        quantity: this.formData.quantity,
        adjustmentType: this.formData.adjustmentType,
        location: this.formData.location || undefined,
        notes: this.formData.notes,
      };
      this.submit.emit(request);
    }
  }

  finishSubmit(): void {
    this.isSubmitting = false;
    this.resetForm();
  }
}
