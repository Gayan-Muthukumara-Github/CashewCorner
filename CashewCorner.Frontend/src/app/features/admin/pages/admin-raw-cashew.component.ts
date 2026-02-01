import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RawCashewService } from '../../../core/services/raw-cashew.service';
import { CreateRawCashewRequest, UpdateRawCashewRequest, RawCashewResponse } from '../../../core/models/raw-cashew.models';
import { RawCashewFormModalComponent } from '../../../shared/components/raw-cashew-form-modal.component';

@Component({
  selector: 'app-admin-raw-cashew',
  standalone: true,
  imports: [CommonModule, FormsModule, RawCashewFormModalComponent],
  templateUrl: './admin-raw-cashew.component.html',
  styleUrl: './admin-raw-cashew.component.scss'
})
export class AdminRawCashewComponent implements OnInit {
  rawCashews: RawCashewResponse[] = [];
  isLoading = false;
  errorMessage = '';
  searchType = '';
  searchQuality = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedRawCashew: RawCashewResponse | null = null;

  constructor(private readonly rawCashewService: RawCashewService) {}

  ngOnInit(): void {
    this.loadRawCashews();
  }

  loadRawCashews(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.searchType || this.searchQuality) {
      this.rawCashewService.searchRawCashews(this.searchType, this.searchQuality).subscribe({
        next: (rawCashews) => {
          this.rawCashews = rawCashews;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.message || 'Failed to search raw cashews.';
          this.isLoading = false;
        }
      });
    } else {
      this.rawCashewService.getRawCashews().subscribe({
        next: (rawCashews) => {
          this.rawCashews = rawCashews;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.message || 'Failed to load raw cashews.';
          this.isLoading = false;
        }
      });
    }
  }

  onSearch(): void {
    this.loadRawCashews();
  }

  clearSearch(): void {
    this.searchType = '';
    this.searchQuality = '';
    this.loadRawCashews();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedRawCashew = null;
    this.isModalOpen = true;
  }

  openEditModal(rawCashew: RawCashewResponse): void {
    this.modalMode = 'edit';
    this.selectedRawCashew = rawCashew;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedRawCashew = null;
  }

  onSaveRawCashew(payload: CreateRawCashewRequest | UpdateRawCashewRequest): void {
    this.errorMessage = '';

    if (this.modalMode === 'create') {
      this.rawCashewService.createRawCashew(payload as CreateRawCashewRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadRawCashews();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.message || 'Failed to create raw cashew type.';
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedRawCashew) {
      this.rawCashewService.updateRawCashew(this.selectedRawCashew.cashewTypeId, payload as UpdateRawCashewRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadRawCashews();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.message || 'Failed to update raw cashew type.';
        }
      });
    }
  }

  deleteRawCashew(cashewTypeId: number): void {
    if (confirm('Are you sure you want to delete this raw cashew type?')) {
      this.rawCashewService.deleteRawCashew(cashewTypeId).subscribe({
        next: () => {
          this.loadRawCashews();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.message || 'Failed to delete raw cashew type.';
        }
      });
    }
  }
}
