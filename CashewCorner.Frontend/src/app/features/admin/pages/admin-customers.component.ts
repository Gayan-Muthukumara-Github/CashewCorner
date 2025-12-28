import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomerService } from '../../../core/services/customer.service';
import { CreateCustomerRequest, UpdateCustomerRequest, CustomerResponse } from '../../../core/models/customer.models';
import { CustomerFormModalComponent } from '../../../shared/components/customer-form-modal.component';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerFormModalComponent],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.scss'
})
export class AdminCustomersComponent implements OnInit {
  customers: CustomerResponse[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedCustomer: CustomerResponse | null = null;

  constructor(private readonly customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.searchTerm) {
      this.customerService.searchCustomers(this.searchTerm).subscribe({
        next: (customers) => {
          this.customers = customers;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to search customers.';
          this.isLoading = false;
        }
      });
    } else {
      this.customerService.getCustomers().subscribe({
        next: (customers) => {
          this.customers = customers;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load customers.';
          this.isLoading = false;
        }
      });
    }
  }

  onSearch(): void {
    this.loadCustomers();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedCustomer = null;
    this.isModalOpen = true;
  }

  openEditModal(customer: CustomerResponse): void {
    this.modalMode = 'edit';
    this.selectedCustomer = customer;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCustomer = null;
  }

  onSaveCustomer(payload: CreateCustomerRequest | UpdateCustomerRequest): void {
    this.errorMessage = '';

    if (this.modalMode === 'create') {
      this.customerService.createCustomer(payload as CreateCustomerRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadCustomers();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to create customer.';
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedCustomer) {
      this.customerService.updateCustomer(this.selectedCustomer.customerId, payload as UpdateCustomerRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadCustomers();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update customer.';
        }
      });
    }
  }

  deleteCustomer(customerId: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(customerId).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to delete customer.';
        }
      });
    }
  }
}
