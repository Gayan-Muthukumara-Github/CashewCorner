import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-customer-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <div class="contact-page">
      <div class="hero-section">
        <div class="container">
          <h1>Contact Us</h1>
          <p class="hero-subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>
      
      <div class="content-section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-info">
              <h2>Get in Touch</h2>
              <p>Have questions about our products or need assistance with your order? We're here to help!</p>
              
              <div class="contact-methods">
                <div class="contact-method">
                  <div class="method-icon">📧</div>
                  <div class="method-details">
                    <h3>Email</h3>
                    <p>info&#64;cashewcorner.com</p>
                    <p>support&#64;cashewcorner.com</p>
                  </div>
                </div>
                
                <div class="contact-method">
                  <div class="method-icon">📞</div>
                  <div class="method-details">
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                    <p>Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>
                
                <div class="contact-method">
                  <div class="method-icon">📍</div>
                  <div class="method-details">
                    <h3>Address</h3>
                    <p>123 Cashew Street<br>Nut City, NC 12345</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="contact-form-section">
              <div class="form-container">
                <h2>Send us a Message</h2>
                <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="contact-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="name">Full Name *</label>
                      <input 
                        type="text" 
                        id="name"
                        formControlName="name" 
                        placeholder="Enter your full name"
                        [class.error]="form.get('name')?.invalid && form.get('name')?.touched"
                      />
                      <div *ngIf="form.get('name')?.invalid && form.get('name')?.touched" class="error-message">
                        Name is required and must be at least 2 characters
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label for="email">Email Address *</label>
                      <input 
                        type="email" 
                        id="email"
                        formControlName="email" 
                        placeholder="Enter your email address"
                        [class.error]="form.get('email')?.invalid && form.get('email')?.touched"
                      />
                      <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="error-message">
                        Please enter a valid email address
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="subject">Subject</label>
                    <select id="subject" formControlName="subject" class="subject-select">
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea 
                      id="message"
                      formControlName="message" 
                      rows="6"
                      placeholder="Tell us how we can help you..."
                      [class.error]="form.get('message')?.invalid && form.get('message')?.touched"
                    ></textarea>
                    <div *ngIf="form.get('message')?.invalid && form.get('message')?.touched" class="error-message">
                      Message is required and must be at least 10 characters
                    </div>
                  </div>
                  
                  <button type="submit" [disabled]="form.invalid" class="submit-btn">
                    <span *ngIf="!isSubmitting">Send Message</span>
                    <span *ngIf="isSubmitting">Sending...</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .contact-page {
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
    
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }
    
    .contact-info h2 {
      font-size: 2rem;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }
    
    .contact-info p {
      color: #64748b;
      line-height: 1.7;
      margin: 0 0 2rem 0;
    }
    
    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .contact-method {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }
    
    .method-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .method-details h3 {
      font-size: 1.25rem;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }
    
    .method-details p {
      color: #64748b;
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
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
    
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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
    
    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-group input.error,
    .form-group textarea.error {
      border-color: #ef4444;
    }
    
    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .subject-select {
      background: white;
    }
    
    .submit-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
    
    .submit-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .submit-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2rem;
      }
      
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .container {
        padding: 0 1rem;
      }
    }
    `
  ]
})
export class ContactComponent {
  private readonly formBuilder = inject(FormBuilder);

  isSubmitting = false;

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', this.form.value);
      this.form.reset();
      this.isSubmitting = false;
      alert('Thank you for your message! We\'ll get back to you soon.');
    }, 1500);
  }
}


