import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RawCashewInventoryService } from '../../../core/services/raw-cashew-inventory.service';
import { RawCashewService } from '../../../core/services/raw-cashew.service';
import {
  RawCashewInventoryResponse,
  RawCashewInventorySummaryResponse,
  ReceiveRawCashewStockRequest,
  AdjustRawCashewStockRequest,
  RawCashewStockMovementResponse,
} from '../../../core/models/raw-cashew-inventory.models';
import { RawCashewResponse } from '../../../core/models/raw-cashew.models';
import { ReceiveRawCashewStockModalComponent } from '../../../shared/components/receive-raw-cashew-stock-modal.component';
import { AdjustRawCashewStockModalComponent } from '../../../shared/components/adjust-raw-cashew-stock-modal.component';

@Component({
  selector: 'app-admin-raw-cashew-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReceiveRawCashewStockModalComponent,
    AdjustRawCashewStockModalComponent,
  ],
  templateUrl: './admin-raw-cashew-inventory.component.html',
  styleUrl: './admin-raw-cashew-inventory.component.scss',
})
export class AdminRawCashewInventoryComponent implements OnInit {
  @ViewChild(ReceiveRawCashewStockModalComponent)
  receiveModal!: ReceiveRawCashewStockModalComponent;
  @ViewChild(AdjustRawCashewStockModalComponent)
  adjustModal!: AdjustRawCashewStockModalComponent;

  inventory: RawCashewInventoryResponse[] = [];
  filteredInventory: RawCashewInventoryResponse[] = [];
  rawCashews: RawCashewResponse[] = [];
  summary: RawCashewInventorySummaryResponse | null = null;
  stockMovements: RawCashewStockMovementResponse[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Filters
  activeFilter: 'all' | 'available' | 'low-stock' = 'all';
  searchTerm = '';
  selectedLocation = '';
  selectedCashewType = '';
  locations: string[] = [];
  cashewTypes: string[] = [];

  // Modals
  receiveStockModalOpen = false;
  adjustStockModalOpen = false;
  movementsModalOpen = false;
  selectedCashewTypeIdForMovements: number | null = null;

  constructor(
    private readonly inventoryService: RawCashewInventoryService,
    private readonly rawCashewService: RawCashewService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
    this.loadSummary();
    this.loadRawCashews();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.inventoryService.getAllInventory().subscribe({
      next: (data) => {
        this.inventory = data;
        this.extractFilters();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading raw cashew inventory:', err);
        this.errorMessage =
          err.error?.message || err.message || 'Failed to load raw cashew inventory.';
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

  loadRawCashews(): void {
    this.rawCashewService.getRawCashews().subscribe({
      next: (data) => {
        this.rawCashews = data;
      },
      error: (err) => {
        console.error('Error loading raw cashew types:', err);
      },
    });
  }

  extractFilters(): void {
    const locationSet = new Set(this.inventory.map((item) => item.location));
    this.locations = Array.from(locationSet).filter(Boolean).sort();

    const cashewTypeSet = new Set(this.inventory.map((item) => item.cashewType));
    this.cashewTypes = Array.from(cashewTypeSet).filter(Boolean).sort();
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
    let filtered = [...this.inventory];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.cashewType.toLowerCase().includes(term) ||
          item.cashewQuality?.toLowerCase().includes(term)
      );
    }

    if (this.selectedLocation) {
      filtered = filtered.filter((item) => item.location === this.selectedLocation);
    }

    if (this.selectedCashewType) {
      filtered = filtered.filter((item) => item.cashewType === this.selectedCashewType);
    }

    this.filteredInventory = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onLocationChange(): void {
    this.applyFilters();
  }

  onCashewTypeChange(): void {
    this.applyFilters();
  }

  refreshInventory(): void {
    this.loadInventory();
    this.loadSummary();
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  getStockStatus(item: RawCashewInventoryResponse): string {
    if (item.availableQuantity <= 0) {
      return 'out-of-stock';
    } else if (item.availableQuantity < 50) {
      return 'low-stock';
    }
    return 'in-stock';
  }

  getStatusLabel(item: RawCashewInventoryResponse): string {
    const status = this.getStockStatus(item);
    switch (status) {
      case 'out-of-stock':
        return 'Out of Stock';
      case 'low-stock':
        return 'Low Stock';
      default:
        return 'In Stock';
    }
  }

  // Modal methods
  openReceiveStockModal(): void {
    this.receiveStockModalOpen = true;
  }

  closeReceiveStockModal(): void {
    this.receiveStockModalOpen = false;
  }

  openAdjustStockModal(): void {
    this.adjustStockModalOpen = true;
  }

  closeAdjustStockModal(): void {
    this.adjustStockModalOpen = false;
  }

  handleReceiveStock(request: ReceiveRawCashewStockRequest): void {
    this.inventoryService.receiveStock(request).subscribe({
      next: () => {
        this.successMessage = 'Stock received successfully!';
        this.receiveModal.finishSubmit();
        this.closeReceiveStockModal();
        this.refreshInventory();
      },
      error: (err) => {
        console.error('Error receiving stock:', err);
        this.errorMessage = err.error?.message || 'Failed to receive stock.';
        this.receiveModal.finishSubmit();
      },
    });
  }

  handleAdjustStock(request: AdjustRawCashewStockRequest): void {
    this.inventoryService.adjustStock(request).subscribe({
      next: () => {
        this.successMessage = 'Stock adjusted successfully!';
        this.adjustModal.finishSubmit();
        this.closeAdjustStockModal();
        this.refreshInventory();
      },
      error: (err) => {
        console.error('Error adjusting stock:', err);
        this.errorMessage = err.error?.message || 'Failed to adjust stock.';
        this.adjustModal.finishSubmit();
      },
    });
  }

  // Stock movements modal
  openMovementsModal(cashewTypeId: number): void {
    this.selectedCashewTypeIdForMovements = cashewTypeId;
    this.loadStockMovements(cashewTypeId);
    this.movementsModalOpen = true;
  }

  closeMovementsModal(): void {
    this.movementsModalOpen = false;
    this.selectedCashewTypeIdForMovements = null;
    this.stockMovements = [];
  }

  loadStockMovements(cashewTypeId: number): void {
    this.inventoryService.getStockMovements(cashewTypeId).subscribe({
      next: (data) => {
        this.stockMovements = data;
      },
      error: (err) => {
        console.error('Error loading stock movements:', err);
      },
    });
  }

  getMovementIcon(movementType: string): string {
    switch (movementType?.toUpperCase()) {
      case 'RECEIVE':
        return '📥';
      case 'ADD':
        return '➕';
      case 'REMOVE':
        return '➖';
      case 'USAGE':
        return '🔧';
      case 'DAMAGE':
        return '⚠️';
      case 'CORRECTION':
        return '✏️';
      case 'SALE':
        return '💰';
      default:
        return '📋';
    }
  }

  getMovementClass(movementType: string): string {
    switch (movementType?.toUpperCase()) {
      case 'RECEIVE':
      case 'ADD':
        return 'positive';
      case 'REMOVE':
      case 'USAGE':
      case 'DAMAGE':
      case 'SALE':
        return 'negative';
      default:
        return 'neutral';
    }
  }
}
