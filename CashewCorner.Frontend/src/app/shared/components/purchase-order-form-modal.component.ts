import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import {
  CreatePurchaseOrderRequest,
  PurchaseOrderResponse,
  PurchaseOrderItemRequest,
} from '../../core/models/purchase-order.models';
import { SupplierResponse, AdvancedSupplierSearchParams } from '../../core/models/supplier.models';
import { RawCashewResponse } from '../../core/models/raw-cashew.models';

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
  @Input() allRawCashews: RawCashewResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreatePurchaseOrderRequest>();

  purchaseOrderForm: FormGroup;
  currentItems: PurchaseOrderItemRequest[] = [];
  selectedRawCashewToAssign: number | null = null;
  quantityToAssign: number = 1;
  unitPriceToAssign: number = 0;

  // Supplier search
  showSupplierSearch = false;
  supplierSearchTerm = '';
  filteredSuppliers: SupplierResponse[] = [];
  selectedSupplier: SupplierResponse | null = null;
  advancedSupplierSearch: AdvancedSupplierSearchParams = {
    name: '',
    phone: '',
    email: '',
    address: '',
    contactPerson: ''
  };
  showAdvancedSupplierSearch = false;

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
    if (changes['allSuppliers']) {
      this.filteredSuppliers = this.allSuppliers;
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
        cashewTypeId: item.cashewTypeId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
      
      // Set selected supplier for display
      this.selectedSupplier = this.allSuppliers.find(s => s.supplierId === this.purchaseOrder?.supplierId) || null;
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
      this.selectedSupplier = null;
    }
    this.selectedRawCashewToAssign = null;
    this.quantityToAssign = 1;
    this.unitPriceToAssign = 0;
    
    // Reset supplier search
    this.showSupplierSearch = false;
    this.supplierSearchTerm = '';
    this.filteredSuppliers = this.allSuppliers;
    this.resetAdvancedSupplierSearch();
  }

  // Supplier search methods
  toggleSupplierSearch(): void {
    this.showSupplierSearch = !this.showSupplierSearch;
    if (this.showSupplierSearch) {
      this.filteredSuppliers = this.allSuppliers;
      this.supplierSearchTerm = '';
    }
  }

  onSupplierSearchChange(): void {
    if (!this.supplierSearchTerm.trim()) {
      this.filteredSuppliers = this.allSuppliers;
      return;
    }
    
    const term = this.supplierSearchTerm.toLowerCase();
    this.filteredSuppliers = this.allSuppliers.filter(s => 
      s.name?.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.contactPerson?.toLowerCase().includes(term)
    );
  }

  toggleAdvancedSupplierSearch(): void {
    this.showAdvancedSupplierSearch = !this.showAdvancedSupplierSearch;
    if (!this.showAdvancedSupplierSearch) {
      this.resetAdvancedSupplierSearch();
      this.filteredSuppliers = this.allSuppliers;
    }
  }

  onAdvancedSupplierSearch(): void {
    const { name, phone, email, address, contactPerson } = this.advancedSupplierSearch;
    
    this.filteredSuppliers = this.allSuppliers.filter(s => {
      const matchName = !name || s.name?.toLowerCase().includes(name.toLowerCase());
      const matchPhone = !phone || s.phone?.toLowerCase().includes(phone.toLowerCase());
      const matchEmail = !email || s.email?.toLowerCase().includes(email.toLowerCase());
      const matchAddress = !address || s.address?.toLowerCase().includes(address.toLowerCase());
      const matchContactPerson = !contactPerson || s.contactPerson?.toLowerCase().includes(contactPerson.toLowerCase());
      
      return matchName && matchPhone && matchEmail && matchAddress && matchContactPerson;
    });
  }

  resetAdvancedSupplierSearch(): void {
    this.advancedSupplierSearch = {
      name: '',
      phone: '',
      email: '',
      address: '',
      contactPerson: ''
    };
    this.showAdvancedSupplierSearch = false;
  }

  selectSupplier(supplier: SupplierResponse): void {
    this.selectedSupplier = supplier;
    this.purchaseOrderForm.patchValue({ supplierId: supplier.supplierId });
    this.showSupplierSearch = false;
    this.supplierSearchTerm = '';
    this.resetAdvancedSupplierSearch();
  }

  clearSelectedSupplier(): void {
    this.selectedSupplier = null;
    this.purchaseOrderForm.patchValue({ supplierId: null });
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Purchase Order' : `Purchase Order Details: ${this.purchaseOrder?.poNumber}`;
  }

  onClose(): void {
    this.purchaseOrderForm.reset();
    this.purchaseOrderForm.enable();
    this.currentItems = [];
    this.selectedRawCashewToAssign = null;
    this.quantityToAssign = 1;
    this.unitPriceToAssign = 0;
    this.selectedSupplier = null;
    this.showSupplierSearch = false;
    this.supplierSearchTerm = '';
    this.resetAdvancedSupplierSearch();
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
          cashewTypeId: Number(item.cashewTypeId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      };

      console.log('Final payload:', createPayload);
      this.save.emit(createPayload);
    }
  }

  onAddItem(): void {
    console.log('Adding item - Raw Cashew:', this.selectedRawCashewToAssign, 'Quantity:', this.quantityToAssign, 'Price:', this.unitPriceToAssign);
    
    if (!this.selectedRawCashewToAssign) {
      alert('Please select a raw cashew type');
      return;
    }

    if (!this.quantityToAssign || this.quantityToAssign <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (!this.unitPriceToAssign || this.unitPriceToAssign <= 0) {
      alert('Please enter a valid item price');
      return;
    }

    // Convert to number for comparison since select returns string
    const cashewTypeIdNumber = Number(this.selectedRawCashewToAssign);
    const rawCashew = this.allRawCashews.find(r => r.cashewTypeId === cashewTypeIdNumber);
    
    if (!rawCashew) {
      console.error('Raw Cashew not found. CashewTypeId:', cashewTypeIdNumber);
      return;
    }

    const existingItemIndex = this.currentItems.findIndex(item => item.cashewTypeId === cashewTypeIdNumber);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      this.currentItems[existingItemIndex].quantity = Number(this.currentItems[existingItemIndex].quantity) + Number(this.quantityToAssign);
      console.log('Updated existing item:', this.currentItems[existingItemIndex]);
    } else {
      // Add new item
      const newItem: PurchaseOrderItemRequest = {
        cashewTypeId: cashewTypeIdNumber,
        quantity: Number(this.quantityToAssign),
        unitPrice: Number(this.unitPriceToAssign)
      };
      this.currentItems.push(newItem);
      console.log('Added new item:', newItem);
    }

    console.log('Current items after add:', this.currentItems);
    
    // Reset selection
    this.selectedRawCashewToAssign = null;
    this.quantityToAssign = 1;
    this.unitPriceToAssign = 0;
  }

  onRemoveItem(index: number): void {
    this.currentItems.splice(index, 1);
  }

  getRawCashewName(cashewTypeId: number): string {
    const rawCashew = this.allRawCashews.find(r => r.cashewTypeId === cashewTypeId);
    return rawCashew ? `${rawCashew.cashewType} (${rawCashew.cashewQuality})` : 'Unknown';
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

  onRawCashewSelectionChange(cashewTypeId: number | null): void {
    console.log('Raw Cashew selected:', cashewTypeId);
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
