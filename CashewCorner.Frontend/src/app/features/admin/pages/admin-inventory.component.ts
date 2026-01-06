import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventoryService } from '../../../core/services/inventory.service';
import { ProductService } from '../../../core/services/product.service';
import {
  InventoryResponse,
  InventorySummaryResponse,
  ReceiveStockRequest,
  AdjustStockRequest,
} from '../../../core/models/inventory.models';
import { ProductResponse } from '../../../core/models/product.models';
import { ReceiveStockModalComponent } from '../../../shared/components/receive-stock-modal.component';
import { AdjustStockModalComponent } from '../../../shared/components/adjust-stock-modal.component';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReceiveStockModalComponent,
    AdjustStockModalComponent,
  ],
  templateUrl: './admin-inventory.component.html',
  styleUrl: './admin-inventory.component.scss',
})
export class AdminInventoryComponent implements OnInit {
  inventory: InventoryResponse[] = [];
  filteredInventory: InventoryResponse[] = [];
  products: ProductResponse[] = [];
  summary: InventorySummaryResponse | null = null;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Filters
  activeFilter: 'all' | 'available' | 'low-stock' = 'all';
  searchTerm = '';
  selectedLocation = '';
  locations: string[] = [];

  // Modals
  receiveStockModalOpen = false;
  adjustStockModalOpen = false;

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
    this.loadSummary();
    this.loadProducts();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.inventoryService.getAllInventory().subscribe({
      next: (data) => {
        this.inventory = data;
        this.extractLocations();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading inventory:', err);
        this.errorMessage =
          err.error?.message || err.message || 'Failed to load inventory.';
        this.isLoading = false;
      },
    });
  }

  loadSummary(): void {
    this.inventoryService.getInventorySummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => {
        console.error('Error loading summary:', err);
      },
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }

  extractLocations(): void {
    const locationSet = new Set(this.inventory.map((item) => item.location));
    this.locations = Array.from(locationSet).sort();
  }

  setFilter(filter: 'all' | 'available' | 'low-stock'): void {
    this.activeFilter = filter;

    if (filter === 'all') {
      this.loadAllInventory();
    } else if (filter === 'available') {
      this.loadAvailableInventory();
    } else if (filter === 'low-stock') {
      this.loadLowStockItems();
    }
  }

  loadAllInventory(): void {
    this.isLoading = true;
    this.inventoryService.getAllInventory().subscribe({
      next: (data) => {
        this.inventory = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading inventory:', err);
        this.errorMessage = 'Failed to load inventory.';
        this.isLoading = false;
      },
    });
  }

  loadAvailableInventory(): void {
    this.isLoading = true;
    this.inventoryService.getAvailableInventory().subscribe({
      next: (data) => {
        this.inventory = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading available inventory:', err);
        this.errorMessage = 'Failed to load available inventory.';
        this.isLoading = false;
      },
    });
  }

  loadLowStockItems(): void {
    this.isLoading = true;
    this.inventoryService.getLowStockItems().subscribe({
      next: (data) => {
        this.inventory = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading low stock items:', err);
        this.errorMessage = 'Failed to load low stock items.';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    let result = [...this.inventory];

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(term) ||
          item.productSku.toLowerCase().includes(term)
      );
    }

    // Filter by location
    if (this.selectedLocation) {
      result = result.filter(
        (item) => item.location === this.selectedLocation
      );
    }

    this.filteredInventory = result;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onLocationChange(): void {
    this.applyFilters();
  }

  refreshInventory(): void {
    this.setFilter(this.activeFilter);
    this.loadSummary();
  }

  // Receive Stock Modal
  openReceiveStockModal(): void {
    this.receiveStockModalOpen = true;
  }

  closeReceiveStockModal(): void {
    this.receiveStockModalOpen = false;
  }

  onReceiveStock(request: ReceiveStockRequest): void {
    this.clearMessages();
    this.inventoryService.receiveStock(request).subscribe({
      next: (response) => {
        this.successMessage = `Stock received successfully for ${response.productName}!`;
        this.closeReceiveStockModal();
        this.refreshInventory();
        setTimeout(() => this.clearMessages(), 5000);
      },
      error: (err) => {
        console.error('Error receiving stock:', err);
        this.errorMessage =
          err.error?.message || err.message || 'Failed to receive stock.';
      },
    });
  }

  // Adjust Stock Modal
  openAdjustStockModal(): void {
    this.adjustStockModalOpen = true;
  }

  closeAdjustStockModal(): void {
    this.adjustStockModalOpen = false;
  }

  onAdjustStock(request: AdjustStockRequest): void {
    this.clearMessages();
    this.inventoryService.adjustStock(request).subscribe({
      next: (response) => {
        this.successMessage = `Stock adjusted successfully for ${response.productName}!`;
        this.closeAdjustStockModal();
        this.refreshInventory();
        setTimeout(() => this.clearMessages(), 5000);
      },
      error: (err) => {
        console.error('Error adjusting stock:', err);
        this.errorMessage =
          err.error?.message || err.message || 'Failed to adjust stock.';
      },
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
