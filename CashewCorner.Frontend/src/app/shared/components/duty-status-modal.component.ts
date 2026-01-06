import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeDutyResponse } from '../../core/models/duty.models';
import { DutyService } from '../../core/services/duty.service';

@Component({
  selector: 'app-duty-status-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './duty-status-modal.component.html',
  styleUrl: './duty-status-modal.component.scss'
})
export class DutyStatusModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() duty: EmployeeDutyResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() statusUpdated = new EventEmitter<EmployeeDutyResponse>();

  selectedStatus: string | null = null;
  isUpdating = false;
  errorMessage = '';

  constructor(private readonly dutyService: DutyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen && this.duty) {
      this.selectedStatus = this.duty.status;
      this.errorMessage = '';
    }
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.errorMessage = '';
  }

  updateStatus(): void {
    if (!this.selectedStatus || !this.duty) {
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    this.dutyService.updateDutyStatus(this.duty.dutyId, this.selectedStatus).subscribe({
      next: (response) => {
        console.log('Duty status updated:', response);
        this.isUpdating = false;
        this.statusUpdated.emit(response);
        this.onClose();
      },
      error: (err) => {
        console.error('Failed to update duty status:', err);
        this.isUpdating = false;
        this.errorMessage = 'Failed to update duty status. Please try again.';
      }
    });
  }

  onClose(): void {
    this.selectedStatus = null;
    this.errorMessage = '';
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
