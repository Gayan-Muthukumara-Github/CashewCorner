import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ProductResponse } from '../../core/models/product.models';
import {
  InventoryResponse,
  AdjustStockRequest,
} from '../../core/models/inventory.models';

@Component({
  selector: 'app-adjust-stock-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adjust-stock-modal.component.html',
  styleUrl: './adjust-stock-modal.component.scss',
})
export class AdjustStockModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() products: ProductResponse[] = [];
  @Input() inventory: InventoryResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AdjustStockRequest>();

  adjustForm!: FormGroup;
  isSubmitting = false;
  availableLocations: string[] = [];
  selectedInventory: InventoryResponse | null = null;

  constructor(private readonly fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetForm();
    }
  }

  private initForm(): void {
    this.adjustForm = this.fb.group({
      productId: [null, Validators.required],
      location: ['', Validators.required],
      adjustmentType: ['ADD', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      notes: ['', Validators.required],
    });
  }

  private resetForm(): void {
    this.adjustForm.reset({ adjustmentType: 'ADD' });
    this.isSubmitting = false;
    this.availableLocations = [];
    this.selectedInventory = null;
  }

  onProductChange(): void {
    const productId = this.adjustForm.get('productId')?.value;
    this.adjustForm.patchValue({ location: '' });
    this.selectedInventory = null;

    if (productId) {
      // Get locations that have this product in inventory
      this.availableLocations = this.inventory
        .filter((inv) => inv.productId === productId)
        .map((inv) => inv.location);
    } else {
      this.availableLocations = [];
    }
  }

  setAdjustmentType(type: 'ADD' | 'SUBTRACT'): void {
    this.adjustForm.patchValue({ adjustmentType: type });
  }

  calculateNewQuantity(): number {
    if (!this.selectedInventory) return 0;

    const quantity = this.adjustForm.get('quantity')?.value || 0;
    const adjustmentType = this.adjustForm.get('adjustmentType')?.value;

    if (adjustmentType === 'ADD') {
      return this.selectedInventory.quantityOnHand + quantity;
    } else {
      return Math.max(0, this.selectedInventory.quantityOnHand - quantity);
    }
  }

  onSubmit(): void {
    if (this.adjustForm.invalid) {
      this.adjustForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.adjustForm.value;
    const request: AdjustStockRequest = {
      productId: formValue.productId,
      quantity: formValue.quantity,
      location: formValue.location,
      adjustmentType: formValue.adjustmentType,
      notes: formValue.notes?.trim() || undefined,
    };

    this.save.emit(request);
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Called when location changes to update selectedInventory
  onLocationChange(): void {
    const productId = this.adjustForm.get('productId')?.value;
    const location = this.adjustForm.get('location')?.value;

    if (productId && location) {
      this.selectedInventory =
        this.inventory.find(
          (inv) => inv.productId === productId && inv.location === location
        ) || null;
    } else {
      this.selectedInventory = null;
    }
  }
}
