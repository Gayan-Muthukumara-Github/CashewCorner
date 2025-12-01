import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-customer-track-order',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  template: `
    <div class="track-page">
      <div class="hero-section">
        <div class="container">
          <h1>Track Your Order</h1>
          <p class="hero-subtitle">Enter your order ID to check the status and location of your shipment.</p>
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
                    <label for="orderId">Order ID *</label>
                    <input 
                      type="text" 
                      id="orderId"
                      formControlName="orderId" 
                      placeholder="Enter your order ID (e.g., CC-123456)"
                      [class.error]="form.get('orderId')?.invalid && form.get('orderId')?.touched"
                    />
                    <div *ngIf="form.get('orderId')?.invalid && form.get('orderId')?.touched" class="error-message">
                      Order ID is required and must be at least 6 characters
                    </div>
                  </div>
                  
                  <button type="submit" [disabled]="form.invalid || isTracking" class="track-btn">
                    <span *ngIf="!isTracking">Track Order</span>
                    <span *ngIf="isTracking">Tracking...</span>
                  </button>
                </form>
              </div>
            </div>
            
            <div class="track-results" *ngIf="orderResult">
              <div class="result-container">
                <h2>Order Status</h2>
                <div class="order-info">
                  <div class="info-row">
                    <span class="label">Order ID:</span>
                    <span class="value">{{ orderResult.orderId }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Status:</span>
                    <span class="value status" [class]="'status-' + orderResult.status.toLowerCase()">
                      {{ orderResult.status }}
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="label">Estimated Delivery:</span>
                    <span class="value">{{ orderResult.estimatedDelivery }}</span>
                  </div>
                </div>
                
                <div class="tracking-timeline">
                  <h3>Tracking Timeline</h3>
                  <div class="timeline">
                    <div class="timeline-item" *ngFor="let event of orderResult.timeline; let i = index" 
                         [class.active]="i <= orderResult.currentStep"
                         [class.completed]="i < orderResult.currentStep">
                      <div class="timeline-marker"></div>
                      <div class="timeline-content">
                        <div class="timeline-title">{{ event.title }}</div>
                        <div class="timeline-date">{{ event.date }}</div>
                        <div class="timeline-location" *ngIf="event.location">{{ event.location }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="help-section" *ngIf="!orderResult">
              <h3>Need Help?</h3>
              <div class="help-options">
                <div class="help-option">
                  <div class="help-icon">📞</div>
                  <div class="help-content">
                    <h4>Call Us</h4>
                    <p>+1 (555) 123-4567</p>
                    <p>Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>
                <div class="help-option">
                  <div class="help-icon">📧</div>
                  <div class="help-content">
                    <h4>Email Support</h4>
                    <p>support&#64;cashewcorner.com</p>
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
            </div>
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
      gap: 4rem;
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
      padding: 0.75rem;
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
    
    .track-results h2 {
      font-size: 1.5rem;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
    }
    
    .order-info {
      margin-bottom: 2rem;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .info-row:last-child {
      border-bottom: none;
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
    }
    
    .status-processing {
      background: #fef3c7;
      color: #92400e;
    }
    
    .status-shipped {
      background: #dbeafe;
      color: #1e40af;
    }
    
    .status-delivered {
      background: #d1fae5;
      color: #065f46;
    }
    
    .tracking-timeline h3 {
      font-size: 1.25rem;
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
      left: 0.75rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e5e7eb;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 1.5rem;
    }
    
    .timeline-item:last-child {
      margin-bottom: 0;
    }
    
    .timeline-marker {
      position: absolute;
      left: -2rem;
      top: 0.25rem;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: #e5e7eb;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #e5e7eb;
    }
    
    .timeline-item.completed .timeline-marker {
      background: #10b981;
      box-shadow: 0 0 0 2px #10b981;
    }
    
    .timeline-item.active .timeline-marker {
      background: #3b82f6;
      box-shadow: 0 0 0 2px #3b82f6;
    }
    
    .timeline-content {
      margin-left: 1rem;
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
      font-size: 0.875rem;
      font-style: italic;
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
      gap: 1.5rem;
    }
    
    .help-option {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
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
    
    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2rem;
      }
      
      .track-container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .container {
        padding: 0 1rem;
      }
    }
    `
  ]
})
export class TrackOrderComponent {
  private readonly formBuilder = inject(FormBuilder);

  isTracking = false;
  orderResult: any = null;

  readonly form = this.formBuilder.group({
    orderId: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isTracking = true;
    this.orderResult = null;
    
    // Simulate API call
    setTimeout(() => {
      const { orderId } = this.form.value;
      this.orderResult = {
        orderId: orderId,
        status: 'Shipped',
        estimatedDelivery: 'Dec 25, 2024',
        currentStep: 2,
        timeline: [
          {
            title: 'Order Placed',
            date: 'Dec 20, 2024',
            location: 'Online Store'
          },
          {
            title: 'Processing',
            date: 'Dec 21, 2024',
            location: 'Warehouse'
          },
          {
            title: 'Shipped',
            date: 'Dec 22, 2024',
            location: 'Distribution Center'
          },
          {
            title: 'Out for Delivery',
            date: 'Dec 24, 2024',
            location: 'Local Delivery'
          },
          {
            title: 'Delivered',
            date: 'Dec 25, 2024',
            location: 'Your Address'
          }
        ]
      };
      this.isTracking = false;
    }, 2000);
  }
}


