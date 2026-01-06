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
import { ReceiveStockRequest } from '../../core/models/inventory.models';

@Component({
  selector: 'app-receive-stock-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './receive-stock-modal.component.html',
  styleUrl: './receive-stock-modal.component.scss',
})
export class ReceiveStockModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() products: ProductResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ReceiveStockRequest>();

  receiveForm!: FormGroup;
  isSubmitting = false;

  constructor(private readonly fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetForm();
    }
  }

  private initForm(): void {
    this.receiveForm = this.fb.group({
      productId: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      location: ['', Validators.required],
      purchaseOrderId: [null],
      notes: [''],
    });
  }

  private resetForm(): void {
    this.receiveForm.reset();
    this.isSubmitting = false;
  }

  onSubmit(): void {
    if (this.receiveForm.invalid) {
      this.receiveForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.receiveForm.value;
    const request: ReceiveStockRequest = {
      productId: formValue.productId,
      quantity: formValue.quantity,
      location: formValue.location.trim(),
      purchaseOrderId: formValue.purchaseOrderId || undefined,
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
}
