import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import {
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderResponse,
  AssignProductRequest,
  OrderItemResponse,
} from '../../core/models/order.models';
import { CustomerResponse } from '../../core/models/customer.models';
import { ProductResponse } from '../../core/models/product.models';

@Component({
  selector: 'app-order-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './order-form-modal.component.html',
  styleUrl: './order-form-modal.component.scss'
})
export class OrderFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() order: OrderResponse | null = null;
  @Input() allCustomers: CustomerResponse[] = [];
  @Input() allProducts: ProductResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateOrderRequest | UpdateOrderRequest>();
  @Output() assignProduct = new EventEmitter<{ orderId: number; productId: number; quantity: number; unitPrice: number }>();
  @Output() updateProductQuantity = new EventEmitter<{ orderId: number; orderItemId: number; quantity: number }>();
  @Output() removeProduct = new EventEmitter<{ orderId: number; orderItemId: number }>();

  orderForm: FormGroup;
  selectedProductToAssign: number | null = null;
  quantityToAssign: number = 1;

  constructor(private readonly fb: FormBuilder) {
    this.orderForm = this.fb.group({
      customerId: [null, [Validators.required]],
      orderDate: ['', [Validators.required]],
      status: ['Pending', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.order) {
      this.orderForm.patchValue({
        customerId: this.order.customerId,
        orderDate: this.order.orderDate.substring(0, 10), // Format date for input type="date"
        status: this.order.status,
      });
      this.orderForm.get('customerId')?.disable();
    } else {
      this.orderForm.reset({
        customerId: null,
        orderDate: new Date().toISOString().substring(0, 10),
        status: 'Pending',
      });
      this.orderForm.get('customerId')?.enable();
    }
    this.selectedProductToAssign = null;
    this.quantityToAssign = 1;
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Order' : `Edit Order: ${this.order?.orderId}`;
  }

  onClose(): void {
    this.orderForm.reset();
    this.orderForm.get('customerId')?.enable();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      Object.values(this.orderForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.orderForm.getRawValue();

    if (this.mode === 'create') {
      const createPayload: CreateOrderRequest = {
        ...formValue,
        totalAmount: 0, // Will be calculated on backend
        items: [], // Will be added separately if needed
      };
      this.save.emit(createPayload);
    } else {
      const updatePayload: UpdateOrderRequest = {
        status: formValue.status,
        orderDate: formValue.orderDate,
      };
      this.save.emit(updatePayload);
    }
  }

  onAssignProduct(): void {
    if (this.order && this.selectedProductToAssign && this.quantityToAssign > 0) {
      const product = this.allProducts.find(p => p.productId === this.selectedProductToAssign);
      if (product) {
        this.assignProduct.emit({
          orderId: this.order.orderId,
          productId: product.productId,
          quantity: this.quantityToAssign,
          unitPrice: product.sellPrice, // Use sell price as unit price for order item
        });
      }
      this.selectedProductToAssign = null;
      this.quantityToAssign = 1;
    }
  }

  onUpdateQuantity(item: OrderItemResponse, event: Event): void {
    const newQuantity = (event.target as HTMLInputElement).valueAsNumber;
    if (this.order && newQuantity > 0) {
      this.updateProductQuantity.emit({
        orderId: this.order.orderId,
        orderItemId: item.orderItemId,
        quantity: newQuantity,
      });
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Helper to get product name for display in assign product dropdown
  getAvailableProducts(): ProductResponse[] {
    if (!this.order) return this.allProducts;
    const assignedProductIds = new Set(this.order.items.map(item => item.productId));
    return this.allProducts.filter(product => !assignedProductIds.has(product.productId));
  }

  get customerId() { return this.orderForm.get('customerId'); }
  get orderDate() { return this.orderForm.get('orderDate'); }
  get status() { return this.orderForm.get('status'); }
}
