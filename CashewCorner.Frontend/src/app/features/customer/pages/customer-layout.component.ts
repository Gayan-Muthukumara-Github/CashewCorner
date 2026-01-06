import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="brand">
              <a routerLink="/customer" class="brand-link">
                <img src="https://imgs.search.brave.com/rN_3lmsO2B6-KLn0SjLQIQiSrmDnUKbp8XT-E4PxK-I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjcv/OTA1LzY1OS9zbWFs/bC9hLWJvd2wtb2Yt/cm9hc3RlZC1jYXNo/ZXdzLXJlYWR5LXRv/LWVhdC1hLWhlYWx0/aHktc25hY2stcG5n/LnBuZw" alt="Cashew Corner" class="brand-icon" />
                <span class="brand-text">Cashew Corner</span>
              </a>
            </div>
            
            <nav class="nav">
              <a routerLink="/customer/about" routerLinkActive="active" class="nav-link">About</a>
              <a routerLink="/customer/products" routerLinkActive="active" class="nav-link">Products</a>
              <a routerLink="/customer/contact" routerLinkActive="active" class="nav-link">Contact</a>
              <a routerLink="/customer/track-order" routerLinkActive="active" class="nav-link">Track Order</a>
              <!--a routerLink="/admin/login" class="nav-link admin-link">Admin</a-->
            </nav>
            
          </div>
        </div>
      </header>
      
      <main class="main">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>Cashew Corner</h3>
              <p>Premium quality cashews delivered fresh to your door. We're passionate about bringing you the finest nuts from around the world.</p>
              <div class="social-links">
                <a href="#" class="social-link">📘</a>
                <a href="#" class="social-link">📷</a>
                <a href="#" class="social-link">🐦</a>
                <a href="#" class="social-link">💼</a>
              </div>
            </div>
            
            <div class="footer-section">
              <h4>Quick Links</h4>
              <ul class="footer-links">
                <li><a routerLink="/customer/about">About Us</a></li>
                <li><a routerLink="/customer/products">Products</a></li>
                <li><a routerLink="/customer/contact">Contact</a></li>
                <li><a routerLink="/customer/track-order">Track Order</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h4>Customer Service</h4>
              <ul class="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Live Chat</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h4>Contact Info</h4>
              <div class="contact-info">
                <p>📧 info&#64;cashewcorner.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 123 Cashew Street<br>Nut City, NC 12345</p>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom">
            <div class="footer-bottom-content">
              <p>&copy; 2025 Cashew Corner. All rights reserved.</p>
              <div class="footer-bottom-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
    .layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }
    
    .brand {
      display: flex;
      align-items: center;
    }
    
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      transition: color 0.2s;
    }
    
    .brand-link:hover {
      color: #fbbf24;
    }
    
    .brand-icon {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
    
    .brand-text {
      background: linear-gradient(45deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .nav {
      display: flex;
      gap: 2rem;
      align-items: center;
    }
    
    .nav-link {
      color: #e2e8f0;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
      position: relative;
    }
    
    .nav-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .nav-link.active {
      color: #fbbf24;
      background: rgba(251, 191, 36, 0.1);
    }
    
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: #fbbf24;
      border-radius: 50%;
    }
    
    .admin-link {
      color: #fde68a !important;
      border: 1px solid #fde68a;
      margin-left: 1rem;
    }
    
    .admin-link:hover {
      background: rgba(253, 230, 138, 0.1);
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .cart-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.9rem;
    }
    
    .cart-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
    
    .cart-icon {
      font-size: 1.2rem;
    }
    
    .cart-count {
      background: #ef4444;
      color: white;
      padding: 0.125rem 0.375rem;
      border-radius: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      min-width: 1.25rem;
      text-align: center;
    }
    
    .main {
      flex: 1;
    }
    
    .footer {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      margin-top: auto;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem;
      padding: 3rem 0 2rem 0;
    }
    
    .footer-section h3 {
      font-size: 1.5rem;
      margin: 0 0 1rem 0;
      background: linear-gradient(45deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .footer-section h4 {
      font-size: 1.125rem;
      margin: 0 0 1rem 0;
      color: #fbbf24;
    }
    
    .footer-section p {
      color: #cbd5e1;
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      text-decoration: none;
      font-size: 1.25rem;
      transition: all 0.2s;
    }
    
    .social-link:hover {
      background: #fbbf24;
      transform: translateY(-2px);
    }
    
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-links li {
      margin-bottom: 0.5rem;
    }
    
    .footer-links a {
      color: #cbd5e1;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .footer-links a:hover {
      color: #fbbf24;
    }
    
    .contact-info p {
      color: #cbd5e1;
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
    }
    
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.5rem 0;
    }
    
    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .footer-bottom p {
      color: #94a3b8;
      margin: 0;
      font-size: 0.9rem;
    }
    
    .footer-bottom-links {
      display: flex;
      gap: 2rem;
    }
    
    .footer-bottom-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    
    .footer-bottom-links a:hover {
      color: #fbbf24;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 0;
      }
      
      .nav {
        gap: 1rem;
      }
      
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 2rem 0 1rem 0;
      }
      
      .footer-bottom-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .footer-bottom-links {
        flex-direction: column;
        gap: 1rem;
      }
      
      .container {
        padding: 0 1rem;
      }
    }
    `
  ]
})
export class CustomerLayoutComponent {}


