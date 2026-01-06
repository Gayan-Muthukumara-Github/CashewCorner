import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SalesOrderService } from '../../../core/services/sales-order.service';
import { SalesOrderResponse } from '../../../core/models/sales-order.models';

interface TimelineEvent {
  title: string;
  date: string;
  location?: string;
  completed: boolean;
  active: boolean;
}

interface OrderTrackingResult {
  salesOrderId: number;
  soNumber: string;
  customerName: string;
  status: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  items: { productName: string; quantity: number; unitPrice: number; lineTotal: number }[];
  timeline: TimelineEvent[];
  currentStep: number;
}

@Component({
  selector: 'app-customer-track-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="track-page">
      <div class="hero-section">
        <div class="container">
          <h1>Track Your Order</h1>
          <p class="hero-subtitle">Enter your order number to check the status and details of your order.</p>
        </div>
      </div>
      
      <div class="content-section">
        <div class="container">
          <div class="track-container">
            <div class="track-form-section">
              <div class="form-container">
                <h2>Enter Order Details</h2>
                <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="track-form">
                  <div class="form-group">
                    <label for="orderId">Order Number *</label>
                    <input 
                      type="text" 
                      id="orderId"
                      formControlName="orderId" 
                      placeholder="Enter your order number (e.g., SO-001)"
                      [class.error]="form.get('orderId')?.invalid && form.get('orderId')?.touched"
                    />
                    @if (form.get('orderId')?.invalid && form.get('orderId')?.touched) {
                      <div class="error-message">
                        Order number is required
                      </div>
                    }
                  </div>
                  
                  <button type="submit" [disabled]="form.invalid || isTracking" class="track-btn">
                    @if (!isTracking) {
                      <span>🔍 Track Order</span>
                    } @else {
                      <span>⏳ Tracking...</span>
                    }
                  </button>
                </form>

                @if (errorMessage) {
                  <div class="error-banner">
                    {{ errorMessage }}
                  </div>
                }
              </div>
            </div>
            
            @if (orderResult) {
              <div class="track-results">
                <div class="result-container">
                  <div class="result-header">
                    <h2>📦 Order Status</h2>
                    <span class="order-number">{{ orderResult.soNumber }}</span>
                  </div>

                  <div class="order-info">
                    <div class="info-row">
                      <span class="label">Customer:</span>
                      <span class="value">{{ orderResult.customerName }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Status:</span>
                      <span class="value status" [class]="'status-' + orderResult.status.toLowerCase()">
                        {{ formatStatus(orderResult.status) }}
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="label">Order Date:</span>
                      <span class="value">{{ orderResult.orderDate | date:'mediumDate' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Delivery Date:</span>
                      <span class="value">{{ orderResult.deliveryDate | date:'mediumDate' }}</span>
                    </div>
                    <div class="info-row total">
                      <span class="label">Total Amount:</span>
                      <span class="value">LKR {{ orderResult.totalAmount | number:'1.2-2' }}</span>
                    </div>
                  </div>

                  <!-- Order Items -->
                  <div class="order-items-section">
                    <h3>🛒 Order Items</h3>
                    <div class="items-table-container">
                      <table class="items-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th class="text-right">Qty</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (item of orderResult.items; track item.productName) {
                            <tr>
                              <td>{{ item.productName }}</td>
                              <td class="text-right">{{ item.quantity }}</td>
                              <td class="text-right">{{ item.unitPrice | number:'1.2-2' }}</td>
                              <td class="text-right">{{ item.lineTotal | number:'1.2-2' }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div class="tracking-timeline">
                    <h3>📍 Order Timeline</h3>
                    <div class="timeline">
                      @for (event of orderResult.timeline; track event.title; let i = $index) {
                        <div class="timeline-item" 
                             [class.active]="event.active"
                             [class.completed]="event.completed">
                          <div class="timeline-marker">
                            @if (event.completed) {
                              <span>✓</span>
                            }
                          </div>
                          <div class="timeline-content">
                            <div class="timeline-title">{{ event.title }}</div>
                            <div class="timeline-date">{{ event.date }}</div>
                            @if (event.location) {
                              <div class="timeline-location">{{ event.location }}</div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  <div class="action-buttons">
                    <button class="secondary-btn" (click)="clearResult()">
                      🔄 Track Another Order
                    </button>
                  </div>
                </div>
              </div>
            } @else {
              <div class="help-section">
                <h3>Need Help?</h3>
                <div class="help-options">
                  <div class="help-option">
                    <div class="help-icon">📞</div>
                    <div class="help-content">
                      <h4>Call Us</h4>
                      <p>+94 (11) 234-5678</p>
                      <p>Mon-Fri: 9AM-6PM</p>
                    </div>
                  </div>
                  <div class="help-option">
                    <div class="help-icon">📧</div>
                    <div class="help-content">
                      <h4>Email Support</h4>
                      <p>support&#64;cashewcorner.lk</p>
                      <p>We'll respond within 24 hours</p>
                    </div>
                  </div>
                  <div class="help-option">
                    <div class="help-icon">💬</div>
                    <div class="help-content">
                      <h4>Live Chat</h4>
                      <p>Available 24/7</p>
                      <p>Get instant help</p>
                    </div>
                  </div>
                </div>

                <div class="order-statuses-info">
                  <h4>Order Status Guide</h4>
                  <div class="status-list">
                    <div class="status-item">
                      <span class="status status-pending">Pending</span>
                      <span class="desc">Order received and awaiting processing</span>
                    </div>
                    <div class="status-item">
                      <span class="status status-confirmed">Confirmed</span>
                      <span class="desc">Order confirmed and being prepared</span>
                    </div>
                    <div class="status-item">
                      <span class="status status-processing">Processing</span>
                      <span class="desc">Order is being processed</span>
                    </div>
                    <div class="status-item">
                      <span class="status status-shipped">Shipped</span>
                      <span class="desc">Order has been shipped</span>
                    </div>
                    <div class="status-item">
                      <span class="status status-delivered">Delivered</span>
                      <span class="desc">Order successfully delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .track-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    
    .hero-section {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
    }
    
    .hero-section h1 {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      background: linear-gradient(45deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin: 0;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .content-section {
      padding: 4rem 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .track-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }
    
    .form-container {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }
    
    .form-container h2 {
      font-size: 1.5rem;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
    }
    
    .track-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-group label {
      font-weight: 600;
      color: #374151;
      font-size: 0.95rem;
    }
    
    .form-group input {
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-group input.error {
      border-color: #ef4444;
    }
    
    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .error-banner {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border: 1px solid #fecaca;
      border-radius: 0.5rem;
      color: #dc2626;
      font-size: 0.9rem;
    }
    
    .track-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      align-self: flex-start;
    }
    
    .track-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    .track-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .track-results {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f1f5f9;
    }
    
    .result-header h2 {
      font-size: 1.5rem;
      color: #1e293b;
      margin: 0;
    }

    .order-number {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    .order-info {
      margin-bottom: 2rem;
      background: #f8fafc;
      border-radius: 0.75rem;
      padding: 1rem;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .info-row:last-child {
      border-bottom: none;
    }

    .info-row.total {
      margin-top: 0.5rem;
      padding-top: 1rem;
      border-top: 2px solid #e2e8f0;
      border-bottom: none;
    }

    .info-row.total .value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #059669;
    }
    
    .label {
      font-weight: 600;
      color: #374151;
    }
    
    .value {
      color: #64748b;
    }
    
    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 0.375rem;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: capitalize;
    }
    
    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-confirmed {
      background: #dbeafe;
      color: #1e40af;
    }
    
    .status-processing {
      background: #e0e7ff;
      color: #3730a3;
    }
    
    .status-shipped {
      background: #cffafe;
      color: #0e7490;
    }
    
    .status-delivered {
      background: #d1fae5;
      color: #065f46;
    }

    .status-cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Order Items Section */
    .order-items-section {
      margin-bottom: 2rem;
    }

    .order-items-section h3 {
      font-size: 1.15rem;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }

    .items-table-container {
      overflow-x: auto;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }

    .items-table th,
    .items-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    .items-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }

    .items-table .text-right {
      text-align: right;
    }

    .items-table tbody tr:hover {
      background: #f8fafc;
    }
    
    .tracking-timeline h3 {
      font-size: 1.15rem;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }
    
    .timeline {
      position: relative;
      padding-left: 2rem;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 0.6rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e5e7eb;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }
    
    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-item.completed,
    .timeline-item.active {
      opacity: 1;
    }
    
    .timeline-marker {
      position: absolute;
      left: -2rem;
      top: 0.125rem;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: #e5e7eb;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      color: white;
    }
    
    .timeline-item.completed .timeline-marker {
      background: #10b981;
      box-shadow: 0 0 0 2px #10b981;
    }
    
    .timeline-item.active .timeline-marker {
      background: #3b82f6;
      box-shadow: 0 0 0 2px #3b82f6;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 2px #3b82f6; }
      50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.3); }
      100% { box-shadow: 0 0 0 2px #3b82f6; }
    }
    
    .timeline-content {
      margin-left: 0.5rem;
    }
    
    .timeline-title {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    
    .timeline-date {
      color: #64748b;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }
    
    .timeline-location {
      color: #64748b;
      font-size: 0.85rem;
      font-style: italic;
    }

    .action-buttons {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .secondary-btn {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .secondary-btn:hover {
      background: #e2e8f0;
    }
    
    .help-section {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }
    
    .help-section h3 {
      font-size: 1.5rem;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
    }
    
    .help-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .help-option {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }

    .help-option:hover {
      background: #f1f5f9;
      transform: translateX(4px);
    }
    
    .help-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    
    .help-content h4 {
      font-size: 1rem;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }
    
    .help-content p {
      color: #64748b;
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
    }

    .order-statuses-info {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .order-statuses-info h4 {
      font-size: 1.1rem;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }

    .status-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-item .status {
      min-width: 100px;
      text-align: center;
    }

    .status-item .desc {
      color: #64748b;
      font-size: 0.875rem;
    }
    
    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2rem;
      }

      .hero-section {
        padding: 60px 0;
      }
      
      .track-container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .container {
        padding: 0 1rem;
      }

      .result-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .status-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
    `
  ]
})
export class TrackOrderComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly salesOrderService = inject(SalesOrderService);

  isTracking = false;
  orderResult: OrderTrackingResult | null = null;
  errorMessage = '';

  readonly form = this.formBuilder.group({
    orderId: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isTracking = true;
    this.orderResult = null;
    this.errorMessage = '';
    
    const orderNo = this.form.value.orderId?.trim() || '';
    
    // Try to parse as numeric ID first, otherwise search by order number
    const numericId = parseInt(orderNo, 10);
    
    if (!isNaN(numericId) && numericId > 0) {
      // Search by ID
      this.salesOrderService.getSalesOrderById(numericId).subscribe({
        next: (order) => {
          this.processOrderResult(order);
          this.isTracking = false;
        },
        error: (err) => {
          console.error('Error fetching order:', err);
          this.searchByOrderNumber(orderNo);
        }
      });
    } else {
      this.searchByOrderNumber(orderNo);
    }
  }

  private searchByOrderNumber(orderNo: string): void {
    this.salesOrderService.searchSalesOrders(orderNo).subscribe({
      next: (orders) => {
        if (orders && orders.length > 0) {
          this.processOrderResult(orders[0]);
        } else {
          this.errorMessage = `No order found with number "${orderNo}". Please check and try again.`;
        }
        this.isTracking = false;
      },
      error: (err) => {
        console.error('Error searching orders:', err);
        this.errorMessage = err.error?.message || 'Failed to find order. Please try again.';
        this.isTracking = false;
      }
    });
  }

  private processOrderResult(order: SalesOrderResponse): void {
    const timeline = this.generateTimeline(order);
    
    this.orderResult = {
      salesOrderId: order.salesOrderId,
      soNumber: order.soNumber,
      customerName: order.customerName,
      status: order.status,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate,
      totalAmount: order.totalAmount,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      })),
      timeline,
      currentStep: this.getCurrentStep(order.status)
    };
  }

  private generateTimeline(order: SalesOrderResponse): TimelineEvent[] {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statuses.indexOf(order.status.toUpperCase());
    
    const timeline: TimelineEvent[] = [
      {
        title: 'Order Placed',
        date: this.formatDateForTimeline(order.orderDate),
        location: 'Online Store',
        completed: currentIndex >= 0,
        active: currentIndex === 0
      },
      {
        title: 'Order Confirmed',
        date: currentIndex >= 1 ? this.formatDateForTimeline(order.createdAt) : 'Pending',
        location: 'Cashew Corner',
        completed: currentIndex >= 1,
        active: currentIndex === 1
      },
      {
        title: 'Processing',
        date: currentIndex >= 2 ? 'In Progress' : 'Pending',
        location: 'Warehouse',
        completed: currentIndex >= 2,
        active: currentIndex === 2
      },
      {
        title: 'Shipped',
        date: currentIndex >= 3 ? 'On the way' : 'Pending',
        location: 'Distribution Center',
        completed: currentIndex >= 3,
        active: currentIndex === 3
      },
      {
        title: 'Delivered',
        date: currentIndex >= 4 ? this.formatDateForTimeline(order.deliveryDate) : order.deliveryDate ? `Expected: ${this.formatDateForTimeline(order.deliveryDate)}` : 'Pending',
        location: 'Your Address',
        completed: currentIndex >= 4,
        active: currentIndex === 4
      }
    ];

    // Handle cancelled status
    if (order.status.toUpperCase() === 'CANCELLED') {
      return [
        {
          title: 'Order Placed',
          date: this.formatDateForTimeline(order.orderDate),
          location: 'Online Store',
          completed: true,
          active: false
        },
        {
          title: 'Order Cancelled',
          date: this.formatDateForTimeline(order.updatedAt),
          location: 'Cashew Corner',
          completed: false,
          active: true
        }
      ];
    }

    return timeline;
  }

  private formatDateForTimeline(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  private getCurrentStep(status: string): number {
    const statusMap: Record<string, number> = {
      'PENDING': 0,
      'CONFIRMED': 1,
      'PROCESSING': 2,
      'SHIPPED': 3,
      'DELIVERED': 4,
      'CANCELLED': -1
    };
    return statusMap[status.toUpperCase()] ?? 0;
  }

  formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  clearResult(): void {
    this.orderResult = null;
    this.errorMessage = '';
    this.form.reset();
  }
}


