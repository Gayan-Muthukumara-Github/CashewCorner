import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SupplierService } from '../../../core/services/supplier.service';
import { RawCashewService } from '../../../core/services/raw-cashew.service';
import { CreateSupplierRequest, UpdateSupplierRequest, SupplierResponse, AdvancedSupplierSearchParams } from '../../../core/models/supplier.models';
import { RawCashewResponse } from '../../../core/models/raw-cashew.models';
import { SupplierFormModalComponent } from '../../../shared/components/supplier-form-modal.component';

@Component({
  selector: 'app-admin-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, SupplierFormModalComponent],
  templateUrl: './admin-suppliers.component.html',
  styleUrl: './admin-suppliers.component.scss'
})
export class AdminSuppliersComponent implements OnInit {
  suppliers: SupplierResponse[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedSupplier: SupplierResponse | null = null;

  // Advanced search
  showAdvancedSearch = false;
  cashewTypes: RawCashewResponse[] = [];
  advancedParams: AdvancedSupplierSearchParams = {};

  constructor(
    private readonly supplierService: SupplierService,
    private readonly rawCashewService: RawCashewService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadCashewTypes();
  }

  loadCashewTypes(): void {
    this.rawCashewService.getRawCashews().subscribe({
      next: (types) => this.cashewTypes = types,
      error: () => {}
    });
  }

  loadSuppliers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.showAdvancedSearch) {
      this.supplierService.advancedSearchSuppliers(this.advancedParams).subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to search suppliers.';
          this.isLoading = false;
        }
      });
    } else if (this.searchTerm) {
      this.supplierService.searchSuppliers(this.searchTerm).subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to search suppliers.';
          this.isLoading = false;
        }
      });
    } else {
      this.supplierService.getSuppliers().subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load suppliers.';
          this.isLoading = false;
        }
      });
    }
  }

  onSearch(): void {
    this.loadSuppliers();
  }

  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
    if (!this.showAdvancedSearch) {
      this.advancedParams = {};
      this.loadSuppliers();
    }
  }

  onAdvancedSearch(): void {
    this.loadSuppliers();
  }

  clearAdvancedSearch(): void {
    this.advancedParams = {};
    this.loadSuppliers();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedSupplier = null;
    this.isModalOpen = true;
  }

  openEditModal(supplier: SupplierResponse): void {
    this.modalMode = 'edit';
    this.selectedSupplier = supplier;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedSupplier = null;
  }

  onSaveSupplier(payload: CreateSupplierRequest | UpdateSupplierRequest): void {
    this.errorMessage = '';

    if (this.modalMode === 'create') {
      this.supplierService.createSupplier(payload as CreateSupplierRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadSuppliers();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to create supplier.';
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedSupplier) {
      this.supplierService.updateSupplier(this.selectedSupplier.supplierId, payload as UpdateSupplierRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadSuppliers();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update supplier.';
        }
      });
    }
  }

  deleteSupplier(supplierId: number): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(supplierId).subscribe({
        next: () => {
          this.loadSuppliers();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to delete supplier.';
        }
      });
    }
  }
}
