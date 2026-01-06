import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeDutyResponse } from '../../core/models/duty.models';
import { SalesOrderResponse } from '../../core/models/sales-order.models';
import { PurchaseOrderResponse } from '../../core/models/purchase-order.models';
import { DutyService } from '../../core/services/duty.service';

@Component({
  selector: 'app-employee-duties-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-duties-list.component.html',
  styleUrl: './employee-duties-list.component.scss'
})
export class EmployeeDutiesListComponent implements OnChanges {
  @Input() duties: EmployeeDutyResponse[] = [];
  @Input() salesOrders: SalesOrderResponse[] = [];
  @Input() purchaseOrders: PurchaseOrderResponse[] = [];
  @Input() isLoading = false;
  @Output() assignDutyClick = new EventEmitter<void>();
  @Output() updateStatusClick = new EventEmitter<EmployeeDutyResponse>();
  @Output() dutiesChanged = new EventEmitter<void>();

  errorMessage = '';

  constructor(private readonly dutyService: DutyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Handle any input changes if needed
  }

  openAssignDutyModal(): void {
    this.assignDutyClick.emit();
  }

  openStatusModal(duty: EmployeeDutyResponse): void {
    this.updateStatusClick.emit(duty);
  }

  deleteDuty(dutyId: number): void {
    if (confirm('Are you sure you want to delete this duty?')) {
      this.dutyService.deleteDuty(dutyId).subscribe({
        next: () => {
          this.errorMessage = '';
          this.dutiesChanged.emit();
        },
        error: (err) => {
          console.error('Failed to delete duty:', err);
          this.errorMessage = 'Failed to delete duty. Please try again.';
        }
      });
    }
  }

  getSalesOrderCustomer(salesOrderId: number): string {
    return this.salesOrders.find(so => so.salesOrderId === salesOrderId)?.customerName || 'Unknown';
  }

  getPurchaseOrderSupplier(purchaseOrderId: number): string {
    return this.purchaseOrders.find(po => po.purchaseOrderId === purchaseOrderId)?.supplierName || 'Unknown';
  }
}
