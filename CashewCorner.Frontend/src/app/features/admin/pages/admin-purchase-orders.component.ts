import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PurchaseOrderService } from '../../../core/services/purchase-order.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { ProductService } from '../../../core/services/product.service';
import {
  CreatePurchaseOrderRequest,
  PurchaseOrderResponse,
} from '../../../core/models/purchase-order.models';
import { SupplierResponse } from '../../../core/models/supplier.models';
import { ProductResponse } from '../../../core/models/product.models';
import { PurchaseOrderFormModalComponent } from '../../../shared/components/purchase-order-form-modal.component';

@Component({
  selector: 'app-admin-purchase-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, PurchaseOrderFormModalComponent],
  templateUrl: './admin-purchase-orders.component.html',
  styleUrl: './admin-purchase-orders.component.scss'
})
export class AdminPurchaseOrdersComponent implements OnInit {
  purchaseOrders: PurchaseOrderResponse[] = [];
  suppliers: SupplierResponse[] = [];
  products: ProductResponse[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedPurchaseOrder: PurchaseOrderResponse | null = null;

  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
    private readonly supplierService: SupplierService,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadPurchaseOrders();
    this.loadSuppliers();
    this.loadProducts();
  }

  loadPurchaseOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.searchTerm) {
      this.purchaseOrderService.searchPurchaseOrders(this.searchTerm).subscribe({
        next: (purchaseOrders) => {
          this.purchaseOrders = purchaseOrders;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to search purchase orders.';
          this.isLoading = false;
        }
      });
    } else {
      this.purchaseOrderService.getAllPurchaseOrders().subscribe({
        next: (purchaseOrders) => {
          this.purchaseOrders = purchaseOrders;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load purchase orders.';
          this.isLoading = false;
        }
      });
    }
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (err) => {
        console.error('Failed to load suppliers:', err);
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      }
    });
  }

  onSearch(): void {
    this.loadPurchaseOrders();
  }

  openCreateModal(): void {
    this.clearMessages();
    this.modalMode = 'create';
    this.selectedPurchaseOrder = null;
    this.isModalOpen = true;
  }

  openDetailsModal(purchaseOrder: PurchaseOrderResponse): void {
    this.clearMessages();
    this.modalMode = 'edit'; // Using 'edit' mode for displaying details only
    this.selectedPurchaseOrder = purchaseOrder;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPurchaseOrder = null;
  }

  onCreatePurchaseOrder(payload: CreatePurchaseOrderRequest): void {
    console.log('Creating purchase order with payload:', payload);
    
    this.clearMessages();
    this.isLoading = true;
    
    this.purchaseOrderService.createPurchaseOrder(payload).subscribe({
      next: (response) => {
        console.log('Purchase order created successfully:', response);
        this.successMessage = `Purchase order ${response.poNumber} created successfully!`;
        this.closeModal();
        this.loadPurchaseOrders();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        console.error('Failed to create purchase order:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        });
        
        // Extract error message from different possible formats
        let errorMsg = 'Failed to create purchase order.';
        
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg = err.error;
          } else if (err.error.message) {
            errorMsg = err.error.message;
          } else if (err.error.error) {
            errorMsg = err.error.error;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        this.errorMessage = errorMsg;
        this.isLoading = false;
      }
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
