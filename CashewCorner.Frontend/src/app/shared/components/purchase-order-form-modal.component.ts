import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import {
  CreatePurchaseOrderRequest,
  PurchaseOrderResponse,
  PurchaseOrderItemRequest,
} from '../../core/models/purchase-order.models';
import { SupplierResponse } from '../../core/models/supplier.models';
import { ProductResponse } from '../../core/models/product.models';

@Component({
  selector: 'app-purchase-order-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './purchase-order-form-modal.component.html',
  styleUrl: './purchase-order-form-modal.component.scss'
})
export class PurchaseOrderFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() purchaseOrder: PurchaseOrderResponse | null = null;
  @Input() allSuppliers: SupplierResponse[] = [];
  @Input() allProducts: ProductResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreatePurchaseOrderRequest>();

  purchaseOrderForm: FormGroup;
  currentItems: PurchaseOrderItemRequest[] = [];
  selectedProductToAssign: number | null = null;
  quantityToAssign: number = 1;
  unitPriceToAssign: number = 0;

  constructor(private readonly fb: FormBuilder) {
    this.purchaseOrderForm = this.fb.group({
      supplierId: [null, [Validators.required]],
      orderDate: ['', [Validators.required]],
      expectedDate: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.purchaseOrder) {
      this.purchaseOrderForm.patchValue({
        supplierId: this.purchaseOrder.supplierId,
        orderDate: this.purchaseOrder.orderDate.substring(0, 10),
        expectedDate: this.purchaseOrder.expectedDate.substring(0, 10),
      });
      this.purchaseOrderForm.disable(); // For viewing details
      this.currentItems = this.purchaseOrder.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
    } else {
      // Create mode - set today's date
      const today = new Date();
      const todayStr = today.toISOString().substring(0, 10);
      
      const defaultExpectedDate = new Date(today);
      defaultExpectedDate.setDate(defaultExpectedDate.getDate() + 7);
      const expectedStr = defaultExpectedDate.toISOString().substring(0, 10);
      
      this.purchaseOrderForm.reset({
        supplierId: null,
        orderDate: todayStr,
        expectedDate: expectedStr,
      });
      this.purchaseOrderForm.enable();
      this.currentItems = [];
    }
    this.selectedProductToAssign = null;
    this.quantityToAssign = 1;
    this.unitPriceToAssign = 0;
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Purchase Order' : `Purchase Order Details: ${this.purchaseOrder?.poNumber}`;
  }

  onClose(): void {
    this.purchaseOrderForm.reset();
    this.purchaseOrderForm.enable();
    this.close.emit();
  }

  onSubmit(): void {
    console.log('Form submit triggered');
    console.log('Form valid:', this.purchaseOrderForm.valid);
    console.log('Form value:', this.purchaseOrderForm.value);
    console.log('Current items:', this.currentItems);

    if (this.purchaseOrderForm.invalid) {
      Object.values(this.purchaseOrderForm.controls).forEach(control => control.markAsTouched());
      console.log('Form is invalid');
      return;
    }

    if (this.currentItems.length === 0) {
      console.log('No items added');
      alert('Please add at least one item to the purchase order');
      return;
    }

    if (this.mode === 'create') {
      const formValue = this.purchaseOrderForm.getRawValue();
      
      // Ensure supplierId is a number
      const supplierId = Number(formValue.supplierId);
      if (isNaN(supplierId)) {
        console.error('Invalid supplier ID');
        alert('Please select a valid supplier');
        return;
      }

      const createPayload: CreatePurchaseOrderRequest = {
        supplierId: supplierId,
        orderDate: formValue.orderDate,
        expectedDate: formValue.expectedDate,
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
    console.log('Adding item - Product:', this.selectedProductToAssign, 'Quantity:', this.quantityToAssign, 'Price:', this.unitPriceToAssign);
    
    if (!this.selectedProductToAssign) {
      alert('Please select a product');
      return;
    }

    if (!this.quantityToAssign || this.quantityToAssign <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (!this.unitPriceToAssign || this.unitPriceToAssign <= 0) {
      alert('Please enter a valid unit price');
      return;
    }

    // Convert to number for comparison since select returns string
    const productIdNumber = Number(this.selectedProductToAssign);
    const product = this.allProducts.find(p => p.productId === productIdNumber);
    
    if (!product) {
      console.error('Product not found. ProductId:', productIdNumber);
      return;
    }

    const existingItemIndex = this.currentItems.findIndex(item => item.productId === productIdNumber);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      this.currentItems[existingItemIndex].quantity = Number(this.currentItems[existingItemIndex].quantity) + Number(this.quantityToAssign);
      console.log('Updated existing item:', this.currentItems[existingItemIndex]);
    } else {
      // Add new item
      const newItem: PurchaseOrderItemRequest = {
        productId: productIdNumber,
        quantity: Number(this.quantityToAssign),
        unitPrice: Number(this.unitPriceToAssign)
      };
      this.currentItems.push(newItem);
      console.log('Added new item:', newItem);
    }

    console.log('Current items after add:', this.currentItems);
    
    // Reset selection
    this.selectedProductToAssign = null;
    this.quantityToAssign = 1;
    this.unitPriceToAssign = 0;
  }

  onRemoveItem(index: number): void {
    this.currentItems.splice(index, 1);
  }

  getProductName(productId: number): string {
    return this.allProducts.find(p => p.productId === productId)?.name || 'Unknown Product';
  }

  getTotalAmount(): number {
    return this.currentItems.reduce((total, item) => {
      return total + (Number(item.quantity) * Number(item.unitPrice));
    }, 0);
  }

  isFormValid(): boolean {
    const supplierId = this.purchaseOrderForm.get('supplierId')?.value;
    const orderDate = this.purchaseOrderForm.get('orderDate')?.value;
    const expectedDate = this.purchaseOrderForm.get('expectedDate')?.value;
    
    return supplierId && orderDate && expectedDate;
  }

  onProductSelectionChange(productId: number | null): void {
    console.log('Product selected:', productId);
  }

  onQuantityChange(quantity: number): void {
    console.log('Quantity changed:', quantity);
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get supplierId() { return this.purchaseOrderForm.get('supplierId'); }
  get orderDate() { return this.purchaseOrderForm.get('orderDate'); }
  get expectedDate() { return this.purchaseOrderForm.get('expectedDate'); }
}
