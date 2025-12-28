import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrderService } from '../../../core/services/order.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ProductService } from '../../../core/services/product.service';
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderResponse,
  AssignProductRequest,
  UpdateProductQuantityRequest,
} from '../../../core/models/order.models';
import { CustomerResponse } from '../../../core/models/customer.models';
import { ProductResponse } from '../../../core/models/product.models';
import { OrderFormModalComponent } from '../../../shared/components/order-form-modal.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderFormModalComponent],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  customers: CustomerResponse[] = [];
  products: ProductResponse[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedOrder: OrderResponse | null = null;

  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadCustomers();
    this.loadProducts();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.searchTerm) {
      this.orderService.searchOrders(this.searchTerm).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to search orders.';
          this.isLoading = false;
        }
      });
    } else {
      this.orderService.getOrders().subscribe({
        next: (orders) => {
          this.orders = orders;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load orders.';
          this.isLoading = false;
        }
      });
    }
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (err) => {
        console.error('Failed to load customers:', err);
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
    this.loadOrders();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedOrder = null;
    this.isModalOpen = true;
  }

  openEditModal(order: OrderResponse): void {
    this.modalMode = 'edit';
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  onSaveOrder(payload: CreateOrderRequest | UpdateOrderRequest): void {
    this.errorMessage = '';

    if (this.modalMode === 'create') {
      this.orderService.createOrder(payload as CreateOrderRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadOrders();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to create order.';
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedOrder) {
      this.orderService.updateOrder(this.selectedOrder.orderId, payload as UpdateOrderRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadOrders();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update order.';
        }
      });
    }
  }

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to delete order.';
        }
      });
    }
  }

  assignProduct(orderId: number, productId: number, quantity: number, unitPrice: number): void {
    const payload: AssignProductRequest = { productId, quantity, unitPrice };
    this.orderService.assignProductToOrder(orderId, payload).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to assign product to order.';
      }
    });
  }

  updateProductQuantity(orderId: number, orderItemId: number, quantity: number): void {
    const payload: UpdateProductQuantityRequest = { quantity };
    this.orderService.updateProductQuantityInOrder(orderId, orderItemId, payload).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to update product quantity.';
      }
    });
  }

  removeProduct(orderId: number, orderItemId: number): void {
    this.orderService.removeProductFromOrder(orderId, orderItemId).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to remove product from order.';
      }
    });
  }

  // Helper to get product name for display
  getProductName(productId: number): string {
    return this.products.find(p => p.productId === productId)?.name || 'Unknown Product';
  }
}
