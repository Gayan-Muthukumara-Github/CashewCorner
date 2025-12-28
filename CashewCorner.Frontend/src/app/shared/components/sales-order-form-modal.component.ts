import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import {
  CreateSalesOrderRequest,
  SalesOrderResponse,
  SalesOrderItemRequest,
} from '../../core/models/sales-order.models';
import { CustomerResponse } from '../../core/models/customer.models';
import { ProductResponse } from '../../core/models/product.models';

@Component({
  selector: 'app-sales-order-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sales-order-form-modal.component.html',
  styleUrl: './sales-order-form-modal.component.scss'
})
export class SalesOrderFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() salesOrder: SalesOrderResponse | null = null;
  @Input() allCustomers: CustomerResponse[] = [];
  @Input() allProducts: ProductResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateSalesOrderRequest>();

  salesOrderForm: FormGroup;
  currentItems: SalesOrderItemRequest[] = [];
  selectedProductToAssign: number | null = null;
  quantityToAssign: number = 1;

  constructor(private readonly fb: FormBuilder) {
    this.salesOrderForm = this.fb.group({
      customerId: [null, [Validators.required]],
      orderDate: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.salesOrder) {
      this.salesOrderForm.patchValue({
        customerId: this.salesOrder.customerId,
        orderDate: this.salesOrder.orderDate.substring(0, 10),
        deliveryDate: this.salesOrder.deliveryDate.substring(0, 10),
      });
      
      this.currentItems = this.salesOrder.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
      
      // Disable form in edit/view mode
      this.salesOrderForm.disable();
    } else {
      // Create mode
      const today = new Date();
      const todayStr = today.toISOString().substring(0, 10);
      
      const defaultDeliveryDate = new Date(today);
      defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 7);
      const deliveryStr = defaultDeliveryDate.toISOString().substring(0, 10);
      
      this.salesOrderForm.reset({
        customerId: null,
        orderDate: todayStr,
        deliveryDate: deliveryStr,
      });
      this.salesOrderForm.enable();
      this.currentItems = [];
    }
    
    // Reset product selection
    this.selectedProductToAssign = null;
    this.quantityToAssign = 1;
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Sales Order' : `Sales Order Details: ${this.salesOrder?.soNumber}`;
  }

  onClose(): void {
    this.salesOrderForm.reset();
    this.salesOrderForm.enable();
    this.currentItems = [];
    this.selectedProductToAssign = null;
    this.quantityToAssign = 1;
    this.close.emit();
  }

  onSubmit(): void {
    console.log('Form submit triggered');
    console.log('Form valid:', this.salesOrderForm.valid);
    console.log('Form value:', this.salesOrderForm.value);
    console.log('Current items:', this.currentItems);

    if (this.salesOrderForm.invalid) {
      Object.values(this.salesOrderForm.controls).forEach(control => control.markAsTouched());
      console.log('Form is invalid');
      return;
    }

    if (this.currentItems.length === 0) {
      console.log('No items added');
      alert('Please add at least one item to the sales order');
      return;
    }

    if (this.mode === 'create') {
      const formValue = this.salesOrderForm.getRawValue();
      
      // Ensure customerId is a number
      const customerId = Number(formValue.customerId);
      if (isNaN(customerId)) {
        console.error('Invalid customer ID');
        alert('Please select a valid customer');
        return;
      }

      const createPayload: CreateSalesOrderRequest = {
        customerId: customerId,
        orderDate: formValue.orderDate,
        deliveryDate: formValue.deliveryDate,
        items: this.currentItems.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      };

      console.log('Final payload:', createPayload);
      this.save.emit(createPayload);
    }
  }

  onAddItem(): void {
    console.log('Adding item - Product:', this.selectedProductToAssign, 'Quantity:', this.quantityToAssign);
    
    if (!this.selectedProductToAssign) {
      alert('Please select a product');
      return;
    }

    if (!this.quantityToAssign || this.quantityToAssign <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    // Convert to number for comparison since select returns string
    const productIdNumber = Number(this.selectedProductToAssign);
    const product = this.allProducts.find(p => p.productId === productIdNumber);
    if (!product) {
      console.error('Product not found. ProductId:', productIdNumber, 'Type:', typeof productIdNumber);
      console.error('Available products:', this.allProducts.map(p => p.productId));
      return;
    }

    const existingItemIndex = this.currentItems.findIndex(item => item.productId === productIdNumber);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      this.currentItems[existingItemIndex].quantity = Number(this.currentItems[existingItemIndex].quantity) + Number(this.quantityToAssign);
      console.log('Updated existing item:', this.currentItems[existingItemIndex]);
    } else {
      // Add new item
      const newItem: SalesOrderItemRequest = {
        productId: productIdNumber,
        quantity: Number(this.quantityToAssign),
        unitPrice: Number(product.sellPrice)
      };
      this.currentItems.push(newItem);
      console.log('Added new item:', newItem);
    }

    console.log('Current items after add:', this.currentItems);
    
    // Reset selection
    this.selectedProductToAssign = null;
    this.quantityToAssign = 1;
  }

  onRemoveItem(index: number): void {
    console.log('Removing item at index:', index);
    this.currentItems.splice(index, 1);
    console.log('Items after removal:', this.currentItems);
  }

  getProductName(productId: number): string {
    return this.allProducts.find(p => p.productId === productId)?.name || 'Unknown Product';
  }

  getProductUnitPrice(productId: number): number {
    return this.allProducts.find(p => p.productId === productId)?.sellPrice || 0;
  }

  getTotalAmount(): number {
    return this.currentItems.reduce((total, item) => {
      return total + (Number(item.quantity) * Number(item.unitPrice));
    }, 0);
  }

  isFormValid(): boolean {
    const customerId = this.salesOrderForm.get('customerId')?.value;
    const orderDate = this.salesOrderForm.get('orderDate')?.value;
    const deliveryDate = this.salesOrderForm.get('deliveryDate')?.value;
    
    return customerId && orderDate && deliveryDate;
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Optional: Add these methods for logging if needed
  onProductSelectionChange(productId: number | null): void {
    console.log('Product selected:', productId);
  }

  onQuantityChange(quantity: number): void {
    console.log('Quantity changed:', quantity);
  }

  // Form control getters
  get customerId() { return this.salesOrderForm.get('customerId'); }
  get orderDate() { return this.salesOrderForm.get('orderDate'); }
  get deliveryDate() { return this.salesOrderForm.get('deliveryDate'); }
}