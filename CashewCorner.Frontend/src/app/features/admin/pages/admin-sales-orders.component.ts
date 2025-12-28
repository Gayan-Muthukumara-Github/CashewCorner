import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SalesOrderService } from '../../../core/services/sales-order.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ProductService } from '../../../core/services/product.service';
import {
  CreateSalesOrderRequest,
  SalesOrderResponse,
} from '../../../core/models/sales-order.models';
import { CustomerResponse } from '../../../core/models/customer.models';
import { ProductResponse } from '../../../core/models/product.models';
import { SalesOrderFormModalComponent } from '../../../shared/components/sales-order-form-modal.component';

@Component({
  selector: 'app-admin-sales-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, SalesOrderFormModalComponent],
  templateUrl: './admin-sales-orders.component.html',
  styleUrl: './admin-sales-orders.component.scss'
})
export class AdminSalesOrdersComponent implements OnInit {
  salesOrders: SalesOrderResponse[] = [];
  customers: CustomerResponse[] = [];
  products: ProductResponse[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedSalesOrder: SalesOrderResponse | null = null;

  constructor(
    private readonly salesOrderService: SalesOrderService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadSalesOrders();
    this.loadCustomers();
    this.loadProducts();
  }

  loadSalesOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.searchTerm.trim()) {
      this.salesOrderService.searchSalesOrders(this.searchTerm).subscribe({
        next: (salesOrders) => {
          this.salesOrders = salesOrders;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Search error:', err);
          this.errorMessage = err.error?.message || err.message || 'Failed to search sales orders.';
          this.isLoading = false;
        }
      });
    } else {
      this.salesOrderService.getAllSalesOrders().subscribe({
        next: (salesOrders) => {
          this.salesOrders = salesOrders;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Load error:', err);
          this.errorMessage = err.error?.message || err.message || 'Failed to load sales orders.';
          this.isLoading = false;
        }
      });
    }
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        console.log('Customers loaded:', customers.length);
      },
      error: (err) => {
        console.error('Failed to load customers:', err);
        this.errorMessage = 'Failed to load customers. Please refresh the page.';
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Products loaded:', products.length);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.errorMessage = 'Failed to load products. Please refresh the page.';
      }
    });
  }

  onSearch(): void {
    this.loadSalesOrders();
  }

  openCreateModal(): void {
    this.clearMessages();
    this.modalMode = 'create';
    this.selectedSalesOrder = null;
    this.isModalOpen = true;
  }

  openDetailsModal(salesOrder: SalesOrderResponse): void {
    this.clearMessages();
    this.modalMode = 'edit';
    this.selectedSalesOrder = salesOrder;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedSalesOrder = null;
  }

  onCreateSalesOrder(payload: CreateSalesOrderRequest): void {
    console.log('Creating sales order with payload:', payload);
    
    this.clearMessages();
    this.isLoading = true;
    
    this.salesOrderService.createSalesOrder(payload).subscribe({
      next: (response) => {
        console.log('Sales order created successfully:', response);
        this.successMessage = `Sales order ${response.soNumber} created successfully!`;
        this.closeModal();
        this.loadSalesOrders();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        console.error('Failed to create sales order:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        });
        
        // Extract error message from different possible formats
        let errorMsg = 'Failed to create sales order.';
        
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

  getCustomerName(customerId: number): string {
    return this.customers.find(c => c.customerId === customerId)?.name || 'Unknown';
  }

  getTotalItems(salesOrder: SalesOrderResponse): number {
    return salesOrder.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}